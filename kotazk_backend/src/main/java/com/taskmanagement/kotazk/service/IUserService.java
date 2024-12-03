package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.User;
import com.taskmanagement.kotazk.payload.CustomResponse;
import com.taskmanagement.kotazk.payload.request.auth.UserActiveRequestDto;
import com.taskmanagement.kotazk.payload.request.auth.UserLoginRequestDto;
import com.taskmanagement.kotazk.payload.request.auth.UserSignupRequestDto;
import com.taskmanagement.kotazk.payload.response.auth.UserLoginResponseDto;
import com.taskmanagement.kotazk.payload.response.user.UserResponseDto;
import jakarta.mail.MessagingException;

import java.io.IOException;

public interface IUserService {
    UserLoginResponseDto login(UserLoginRequestDto login);
    CustomResponse signup(UserSignupRequestDto signupRequest) throws IOException, InterruptedException, MessagingException;
    CustomResponse activeAccount(UserActiveRequestDto userActiveRequestDto) throws MessagingException;
    CustomResponse resendToken(String email) throws MessagingException;
    Boolean logout();
    User verifyIDToken(String idToken);
    String processOAuthPostLogin(String idToken);
    UserResponseDto getOneByEmail(String email);
    UserResponseDto getCurrentUser();
}
