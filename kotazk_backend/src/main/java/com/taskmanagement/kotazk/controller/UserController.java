package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.user.UpdateBasicInfoUserRequestDto;
import com.taskmanagement.kotazk.payload.response.member.MemberResponseDto;
import com.taskmanagement.kotazk.payload.response.user.UserResponseDto;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.IUserService;
import com.taskmanagement.kotazk.service.impl.MemberService;
import com.taskmanagement.kotazk.service.impl.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static com.taskmanagement.kotazk.config.ConstantConfig.DEFAULT_ENDPOINT_SECURE_PART;

@RestController
@RequestMapping(DEFAULT_ENDPOINT_SECURE_PART + "/user")
@RequiredArgsConstructor
public class UserController {
    @Autowired
    IUserService userService = new UserService();

    @PutMapping("/")
    @ResponseStatus(HttpStatus.OK)
    public UserResponseDto update(@Valid @RequestBody UpdateBasicInfoUserRequestDto updateBasicInfoUserRequestDto) {
        return userService.uploadBasicInfo(updateBasicInfoUserRequestDto);
    }

    @PutMapping("/upload-avatar")
    @ResponseStatus(HttpStatus.OK)
    public UserResponseDto getFile(@Valid @RequestBody MultipartFile file) throws IOException {
        return userService.uploadAvatar(file);
    }

    @GetMapping("/by-email")
    @ResponseStatus(HttpStatus.OK)
    public UserResponseDto getOne(@Param("email") String email) {
        return userService.getOneByEmail(email);
    }

    @GetMapping("/current")
    @ResponseStatus(HttpStatus.OK)
    public UserResponseDto getCurrentOne() {
        return userService.getCurrentUser();
    }
}
