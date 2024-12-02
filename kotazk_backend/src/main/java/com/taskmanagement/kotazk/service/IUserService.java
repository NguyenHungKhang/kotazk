package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.User;
import com.taskmanagement.kotazk.payload.request.auth.UserLoginRequestDto;
import com.taskmanagement.kotazk.payload.request.auth.UserSignupRequestDto;
import com.taskmanagement.kotazk.payload.response.auth.UserLoginResponseDto;
import com.taskmanagement.kotazk.payload.response.user.UserResponseDto;

import java.io.IOException;

public interface IUserService {
    UserLoginResponseDto login(UserLoginRequestDto login);
    UserLoginResponseDto signup(UserSignupRequestDto signupRequest) throws IOException, InterruptedException;
    Boolean logout();
    User verifyIDToken(String idToken);
    String processOAuthPostLogin(String idToken);
    UserResponseDto getOneByEmail(String email);
    UserResponseDto getCurrentUser();
}
