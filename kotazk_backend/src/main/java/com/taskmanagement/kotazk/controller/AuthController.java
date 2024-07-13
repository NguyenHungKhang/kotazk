package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.entity.RefreshToken;
import com.taskmanagement.kotazk.entity.User;
import com.taskmanagement.kotazk.payload.CustomResponse;
import com.taskmanagement.kotazk.payload.request.auth.UserLoginRequestDto;
import com.taskmanagement.kotazk.payload.request.auth.UserSignupRequestDto;
import com.taskmanagement.kotazk.payload.response.auth.UserLoginResponseDto;
import com.taskmanagement.kotazk.repository.IUserRepository;
import com.taskmanagement.kotazk.security.JwtToken;
import com.taskmanagement.kotazk.service.IUserService;
import com.taskmanagement.kotazk.service.impl.RefreshTokenService;
import com.taskmanagement.kotazk.service.impl.UserService;
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
import java.util.Locale;
import java.util.Optional;

@RestController
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
    public ResponseEntity<?> signup(@Valid @RequestBody UserSignupRequestDto signupRequest) throws IOException, InterruptedException {
        return new ResponseEntity<UserLoginResponseDto>(userService.signup(signupRequest), HttpStatus.OK);
    }

    // normal login
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginRequestDto login, HttpServletResponse response) {
        UserLoginResponseDto userLoginResponse = userService.login(login);

        ResponseCookie accessTokenCookie = ResponseCookie.from("AUTH-TOKEN", userLoginResponse.getAccess_token())
                .httpOnly(true).maxAge(3600).path("/").secure(false).build();
        ResponseCookie refreshTokenCookie = ResponseCookie.from("REFRESH-TOKEN", userLoginResponse.getRefresh_token())
                .httpOnly(true).maxAge(14 * 24 * 3600).path("/").secure(false).build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
        return ResponseEntity.ok().build();
    }

    // normal logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal UserDetails userDetails, HttpServletResponse response) {

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
