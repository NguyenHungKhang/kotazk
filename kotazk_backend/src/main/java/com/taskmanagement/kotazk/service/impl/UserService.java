package com.taskmanagement.kotazk.service.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.taskmanagement.kotazk.entity.User;
import com.taskmanagement.kotazk.entity.enums.UserActiveStatus;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.auth.UserLoginRequestDto;
import com.taskmanagement.kotazk.payload.request.auth.UserSignupRequestDto;
import com.taskmanagement.kotazk.payload.response.auth.UserLoginResponseDto;
import com.taskmanagement.kotazk.repository.IUserRepository;
import com.taskmanagement.kotazk.security.JwtToken;
import com.taskmanagement.kotazk.service.IUserService;
import com.taskmanagement.kotazk.util.ActiveTokenUtil;
import com.taskmanagement.kotazk.util.TimeUtil;
import io.jsonwebtoken.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.GeneralSecurityException;
import java.sql.Timestamp;
import java.util.Collections;
import java.util.Optional;

@Service
public class UserService implements IUserService {
    @Autowired
    private IUserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TimeUtil timeUtil;
    private GoogleIdTokenVerifier verifier;
    @Autowired
    private JwtToken jwtToken;

    @Value("${app.googleClientId}")
    private String googleClientId;
    @Override
    public UserLoginResponseDto login(UserLoginRequestDto login) {
        User user = userRepository.findByEmail(login.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("user", "email", login.getEmail()));

        if(!checkPassword(login.getPassword(), user.getHashedPassword()))
            throw new CustomException("Wrong password!");

        if(!user.getAccountStatus().equals(UserActiveStatus.ACTIVE))
            throw new CustomException("Account have not activated!");

        return UserLoginResponseDto.builder()
                .access_token(jwtToken.generateToken(user))
                .build();
    }

    @Override
    public UserLoginResponseDto signup(UserSignupRequestDto signupRequest) throws java.io.IOException, InterruptedException {
        Optional<User> user = userRepository.findByEmail(signupRequest.getEmail());
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        if (user.isPresent())
            throw new CustomException("User already exists with the provided details.");

        if (!signupRequest.getPassword().equals(signupRequest.getRetypePassword()))
            throw new CustomException("Password and Retype Password do not match.");

        String activeToken = ActiveTokenUtil.generateToken();

        User newUser = User.builder()
                .firstName(signupRequest.getFirstName())
                .lastName(signupRequest.getLastName())
                .email(signupRequest.getEmail())
                .hashedPassword(passwordEncoder.encode(signupRequest.getPassword()))
                .accountStatus(UserActiveStatus.PENDING)
                .activeToken(activeToken)
                .activeDeadline(new Timestamp(currentTime.getTime() + (3 * 60 * 1000)))
                .build();

        userRepository.save(newUser);

        return null;
    }

    @Override
    public Boolean logout(Long id) {
        return null;
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
}
