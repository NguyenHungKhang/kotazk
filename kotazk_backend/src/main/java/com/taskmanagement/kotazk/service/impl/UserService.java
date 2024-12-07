package com.taskmanagement.kotazk.service.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.taskmanagement.kotazk.entity.Member;
import com.taskmanagement.kotazk.entity.Project;
import com.taskmanagement.kotazk.entity.User;
import com.taskmanagement.kotazk.entity.enums.MemberStatus;
import com.taskmanagement.kotazk.entity.enums.ProjectPermission;
import com.taskmanagement.kotazk.entity.enums.Role;
import com.taskmanagement.kotazk.entity.enums.UserActiveStatus;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.CustomResponse;
import com.taskmanagement.kotazk.payload.request.auth.UserActiveRequestDto;
import com.taskmanagement.kotazk.payload.request.auth.UserLoginRequestDto;
import com.taskmanagement.kotazk.payload.request.auth.UserSignupRequestDto;
import com.taskmanagement.kotazk.payload.response.auth.UserLoginResponseDto;
import com.taskmanagement.kotazk.payload.response.project.ProjectResponseDto;
import com.taskmanagement.kotazk.payload.response.user.UserResponseDto;
import com.taskmanagement.kotazk.repository.IMemberRepository;
import com.taskmanagement.kotazk.repository.IUserRepository;
import com.taskmanagement.kotazk.security.JwtToken;
import com.taskmanagement.kotazk.service.IUserService;
import com.taskmanagement.kotazk.util.*;
import io.jsonwebtoken.io.IOException;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.security.GeneralSecurityException;
import java.sql.Timestamp;
import java.util.*;

@Service
@Transactional
public class UserService implements IUserService {
    @Autowired
    private IUserRepository userRepository;
    @Autowired
    private IMemberRepository memberRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TimeUtil timeUtil;
    private GoogleIdTokenVerifier verifier;
    @Autowired
    private JwtToken jwtToken;
    @Autowired
    private RefreshTokenService refreshTokenService = new RefreshTokenService();
    @Autowired
    private FileUtil fileUtil;
    @Autowired
    private SendEmailUtil sendEmailUtil;

    @Value("${app.googleClientId}")
    private String googleClientId;

    @Override
    public UserLoginResponseDto login(UserLoginRequestDto login) {
        User user = userRepository.findByEmail(login.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("user", "email", login.getEmail()));

        if (!checkPassword(login.getPassword(), user.getHashedPassword()))
            throw new CustomException("Wrong password!");

        if (!user.getAccountStatus().equals(UserActiveStatus.ACTIVE))
            throw new CustomException("Account have not activated!");

        return UserLoginResponseDto.builder()
                .access_token(jwtToken.generateToken(user))
                .build();
    }

    @Override
    public CustomResponse signup(UserSignupRequestDto signupRequest) throws java.io.IOException, InterruptedException, MessagingException {
        Optional<User> user = userRepository.findByEmail(signupRequest.getEmail());
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        if (user.isPresent())
            throw new CustomException("User already exists with the provided details.");
        if (!signupRequest.getPassword().equals(signupRequest.getRetypePassword()))
            throw new CustomException("Password and Retype Password do not match.");
        String activeToken = RandomStringGeneratorUtil.generateToken();

        User newUser = User.builder()
                .firstName(signupRequest.getFirstName())
                .lastName(signupRequest.getLastName())
                .email(signupRequest.getEmail())
                .hashedPassword(passwordEncoder.encode(signupRequest.getPassword()))
                .accountStatus(UserActiveStatus.PENDING)
                .activeToken(activeToken)
                .activeDeadline(new Timestamp(currentTime.getTime() + (10 * 60 * 1000)))
                .role(Role.USER)
                .build();


        sendOtpEmail(signupRequest.getEmail(), activeToken);
        userRepository.save(newUser);
        CustomResponse customResponse = new CustomResponse();
        customResponse.setMessage("Create account successful! Check your email to active account.");
        customResponse.setSuccess(true);
        return customResponse;
    }

    @Override
    public UserResponseDto uploadAvatar(MultipartFile file) throws java.io.IOException {
        User currentUser = SecurityUtil.getCurrentUser();

        User existUser = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("user", "id", currentUser.getId()));

        String url = existUser.getAvatar();
        if (url != null)
            fileUtil.deleteFile(url);

        String fileUrl = fileUtil.uploadFile(file, "avatar-user-" + existUser.getId() + "-" + UUID.randomUUID().toString());
        existUser.setAvatar(fileUrl);
        User savedUser = userRepository.save(existUser);

        return ModelMapperUtil.mapOne(savedUser, UserResponseDto.class);
    }

    @Override
    public CustomResponse activeAccount(UserActiveRequestDto userActiveRequestDto) throws MessagingException {
        Optional<User> user = userRepository.findByEmail(userActiveRequestDto.getEmail());
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        if (!user.isPresent())
            throw new CustomException("User not founded");
        if (user.get().getAccountStatus() == UserActiveStatus.ACTIVE)
            throw new CustomException("Account already activated");
        if (user.get().getActiveDeadline().before(currentTime))
            throw new CustomException("OTP expired! Please click \"Resend OTP\" to send new OTP to your email");
        if (user.get().getActiveToken().equals(userActiveRequestDto.getOtp()))
            user.get().setAccountStatus(UserActiveStatus.ACTIVE);
        else
            throw new CustomException("OTP incorrect");

        User savedUser = userRepository.save(user.get());

        List<Member> members = memberRepository.findByEmail(savedUser.getEmail());
        List<Member> savedMember = members.stream()
                .map(m -> {
                    m.setUser(savedUser);
                    return m;
                })
                .toList();
        memberRepository.saveAll(savedMember);

        CustomResponse customResponse = new CustomResponse();
        customResponse.setMessage("Account is activated.");
        customResponse.setSuccess(true);

        return customResponse;
    }

    @Override
    public CustomResponse resendToken(String email) throws MessagingException {
        Optional<User> user = userRepository.findByEmail(email);
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        if (!user.isPresent())
            throw new CustomException("User not founded");
        if (user.get().getAccountStatus() == UserActiveStatus.ACTIVE)
            throw new CustomException("Account already activated");

        Timestamp newDeadline = new Timestamp(currentTime.getTime() + (10 * 60 * 1000));
        String activeToken = RandomStringGeneratorUtil.generateToken();
        user.get().setActiveToken(activeToken);
        user.get().setActiveDeadline(newDeadline);
        User savedUser = userRepository.saveAndFlush(user.get());
        sendOtpEmail(user.get().getEmail(), activeToken);
        CustomResponse customResponse = new CustomResponse();
        customResponse.setMessage("OTP already resent to your email");
        customResponse.setSuccess(false);
        return customResponse;
    }

    @Override
    public Boolean logout() {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser != null) {
            refreshTokenService.deleteByUserId(currentUser.getId());
            return true;
        } else {
            throw new SecurityException("User does not have permission to logout this account.");
        }
    }

    @Override
    public String processOAuthPostLogin(String idToken) {
        User user = verifyIDToken(idToken);
        if (user == null) {
            throw new IllegalArgumentException();
        }
        Optional<User> existUser = userRepository.findByEmail(user.getEmail());
        if (existUser.isPresent()) {
            user.setFirstName(existUser.get().getFirstName());
            user.setLastName(existUser.get().getLastName());
        } else {
            userRepository.save(user);
        }
        Optional<User> updatedUser = userRepository.findByEmail(user.getEmail());
        return jwtToken.generateToken(updatedUser.get());
    }

    @Override
    public UserResponseDto getOneByEmail(String email) {
        User currentUser = SecurityUtil.getCurrentUser();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return ModelMapperUtil.mapOne(user, UserResponseDto.class);
    }

    @Override
    public UserResponseDto getCurrentUser() {
        User currentUser = SecurityUtil.getCurrentUser();
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));
        return ModelMapperUtil.mapOne(user, UserResponseDto.class);
    }

    @Override
    public User verifyIDToken(String idToken) {

        NetHttpTransport transport = new NetHttpTransport();
        JsonFactory jsonFactory = new GsonFactory();
        verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                .setAudience(Collections.singletonList(googleClientId)).build();

        try {
            GoogleIdToken idTokenObj = verifier.verify(idToken);
            if (idTokenObj == null) {
                return null;
            }
            User user = new User();
            GoogleIdToken.Payload payload = idTokenObj.getPayload();
            user.setFirstName((String) payload.get("given_name"));
            user.setLastName((String) payload.get("family_name"));
            user.setEmail((String) payload.get("email"));
            return user;

        } catch (GeneralSecurityException | IOException e) {
            return null;
        } catch (java.io.IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean checkPassword(String plainPassword, String hashedPassword) {
        return passwordEncoder.matches(plainPassword, hashedPassword);
    }

    public void sendOtpEmail(String email, String otp) throws MessagingException {
        String to = email;
        String subject = "Registration Successful - Confirm Your Kotazk Account";
        String body = """
                <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #eaeaea; border-radius: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                    <div style="background-color: #3D42E9; color: white; padding: 15px 20px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                        <h1>Welcome to Kotazk!</h1>
                    </div>
                    <div style="padding: 20px;">
                        <p>Hi there,</p>
                        <p>Thank you for joining our platform! We’re thrilled to have you on board.</p>
                        <p>Your OTP for account confirmation is:</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <span style="font-size: 24px; font-weight: bold; background-color: #f9f9f9; padding: 10px 20px; border: 1px dashed #3D42E9; color: #3D42E9; display: inline-block; border-radius: 5px;">
                                """ + otp + """
                            </span>
                        </div>
                        <p style="color: #555;">Please use this OTP within the next <strong>10 minutes</strong> to confirm your account.</p>
                        <p>If you didn’t request this, please ignore this email or contact our support team.</p>
                    </div>
                    <div style="background-color: #f1f1f1; padding: 10px 20px; text-align: center; font-size: 14px; color: #777; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                        <p>© 2024 Kotazk. All rights reserved.</p>
                        <p><a href="https://kotazk.com" style="color: #3D42E9; text-decoration: none;">Visit our website</a> | <a href="mailto:support@kotazk.com" style="color: #3D42E9; text-decoration: none;">Contact Support</a></p>
                    </div>
                </div>
                """;

        sendEmailUtil.sendEmail(Collections.singletonList(to), subject, body);
    }
}
