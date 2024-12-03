package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.entity.RefreshToken;
import com.taskmanagement.kotazk.entity.User;
import com.taskmanagement.kotazk.payload.CustomResponse;
import com.taskmanagement.kotazk.payload.request.auth.UserActiveRequestDto;
import com.taskmanagement.kotazk.payload.request.auth.UserLoginRequestDto;
import com.taskmanagement.kotazk.payload.request.auth.UserResendRequestDto;
import com.taskmanagement.kotazk.payload.request.auth.UserSignupRequestDto;
import com.taskmanagement.kotazk.payload.response.auth.UserLoginResponseDto;
import com.taskmanagement.kotazk.repository.IUserRepository;
import com.taskmanagement.kotazk.security.JwtToken;
import com.taskmanagement.kotazk.service.IUserService;
import com.taskmanagement.kotazk.service.impl.RefreshTokenService;
import com.taskmanagement.kotazk.service.impl.UserService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.LocaleResolver;

import java.io.IOException;
import java.security.Principal;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/public/auth")
public class AuthController {
    @Autowired
    IUserService userService = new UserService();
    @Autowired
    IUserRepository userRepository;
    @Autowired
    RefreshTokenService refreshTokenService = new RefreshTokenService();
    @Autowired
    JwtToken jwtToken = new JwtToken();

    // signup
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody UserSignupRequestDto signupRequest) throws IOException, InterruptedException, MessagingException {
        return new ResponseEntity<CustomResponse>( userService.signup(signupRequest), HttpStatus.OK);
    }

    @PostMapping("/active")
    public ResponseEntity<?> active(@Valid @RequestBody UserActiveRequestDto userActiveRequestDto) throws MessagingException {
        return new ResponseEntity<CustomResponse>(userService.activeAccount(userActiveRequestDto), HttpStatus.OK);
    }

    @PostMapping("/resend")
    public ResponseEntity<?> resend(@Valid @RequestBody UserResendRequestDto userResendRequestDto) throws MessagingException {
        return new ResponseEntity<CustomResponse>(userService.resendToken(userResendRequestDto.getEmail()), HttpStatus.OK);
    }

    // normal login
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginRequestDto login, HttpServletResponse response) {
        UserLoginResponseDto userLoginResponse = userService.login(login);

        // Create cookies for accessToken and refreshToken
        ResponseCookie accessTokenCookie = ResponseCookie.from("AUTH-TOKEN", userLoginResponse.getAccess_token())
                .httpOnly(false).maxAge(3600).path("/").secure(false).build();
        ResponseCookie refreshTokenCookie = ResponseCookie.from("REFRESH-TOKEN", userLoginResponse.getRefresh_token())
                .httpOnly(false).maxAge(14 * 24 * 3600).path("/").secure(false).build();

        // Add cookies to the response headers
        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

        // Include tokens in the JSON response body
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("accessToken", userLoginResponse.getAccess_token());
        responseBody.put("refreshToken", userLoginResponse.getRefresh_token());

        return ResponseEntity.ok(responseBody);
    }
    // normal logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal UserDetails userDetails, HttpServletResponse response) {
        Boolean userLogoutResponse = userService.logout();
        ResponseCookie accessTokenCookie = ResponseCookie.from("AUTH-TOKEN", "")
                .httpOnly(true).maxAge(0).path("/").secure(false).build();
        ResponseCookie refreshTokenCookie = ResponseCookie.from("REFRESH-TOKEN", "")
                .httpOnly(true).maxAge(0).path("/").secure(false).build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

        return ResponseEntity.ok().build();
    }

    // forgot password

    // active account

    // renew active token

    // ....

    // login with google
    @PostMapping("/login/google")
    public ResponseEntity LoginWithGoogleOauth2(@RequestBody String idToken, HttpServletResponse response) {
        idToken = idToken.replaceAll("\"", "");
        String authToken = userService.processOAuthPostLogin(idToken);
        final ResponseCookie accessTokenCookie = ResponseCookie.from("AUTH-TOKEN", authToken).httpOnly(false).maxAge(3600)
                .path("/").secure(false).build();

        Optional<User> user = userRepository.findByEmail(userService.verifyIDToken(idToken).getEmail());

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.get().getId());
        String refreshTokenString = refreshToken.getToken();
        final ResponseCookie refreshTokenCookie = ResponseCookie.from("REFRESH-TOKEN", refreshTokenString)
                .httpOnly(false).maxAge(14 * 24 * 3600).path("/").secure(false).build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
        return ResponseEntity.ok().build();
    }
}
