package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.auth.UserLoginRequestDto;
import com.taskmanagement.kotazk.payload.response.auth.UserLoginResponseDto;
import org.springframework.stereotype.Service;

@Service
public class TestService {
    public Boolean testPost() {
        if (true)
            throw new ResourceNotFoundException("user", "test value", "test");
        return true;
    }
}
