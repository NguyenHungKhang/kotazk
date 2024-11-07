package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.response.member.MemberResponseDto;
import com.taskmanagement.kotazk.payload.response.user.UserResponseDto;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.IUserService;
import com.taskmanagement.kotazk.service.impl.MemberService;
import com.taskmanagement.kotazk.service.impl.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import static com.taskmanagement.kotazk.config.ConstantConfig.DEFAULT_ENDPOINT_SECURE_PART;

@RestController
@RequestMapping(DEFAULT_ENDPOINT_SECURE_PART + "/user")
@RequiredArgsConstructor
public class UserController {
    @Autowired
    IUserService userService = new UserService();

    @GetMapping("/by-email")
    @ResponseStatus(HttpStatus.OK)
    public UserResponseDto getOne(@Param("email") String email) {
        return userService.getOneByEmail(email);
    }
}
