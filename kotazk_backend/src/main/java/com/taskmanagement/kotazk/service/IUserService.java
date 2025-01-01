package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.User;
import com.taskmanagement.kotazk.payload.CustomResponse;
import com.taskmanagement.kotazk.payload.request.auth.UserActiveRequestDto;
import com.taskmanagement.kotazk.payload.request.auth.UserLoginRequestDto;
import com.taskmanagement.kotazk.payload.request.auth.UserSignupRequestDto;
import com.taskmanagement.kotazk.payload.request.user.UpdateBasicInfoUserRequestDto;
import com.taskmanagement.kotazk.payload.response.auth.UserLoginResponseDto;
import com.taskmanagement.kotazk.payload.response.user.UserResponseDto;
import jakarta.mail.MessagingException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IUserService {
    UserLoginResponseDto login(UserLoginRequestDto login);
    UserResponseDto uploadBasicInfo(UpdateBasicInfoUserRequestDto login);
    CustomResponse signup(UserSignupRequestDto signupRequest) throws IOException, InterruptedException, MessagingException;
    UserResponseDto changePassword();
    UserResponseDto uploadAvatar(MultipartFile file) throws IOException;
    CustomResponse activeAccount(UserActiveRequestDto userActiveRequestDto) throws MessagingException;
    CustomResponse resendToken(String email) throws MessagingException;
    Boolean logout();
    User verifyIDToken(String idToken);
    String processOAuthPostLogin(String idToken);
    UserResponseDto getOneByEmail(String email);
    UserResponseDto getCurrentUser();
}
