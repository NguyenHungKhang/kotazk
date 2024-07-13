package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.auth.UserLoginRequestDto;
import com.taskmanagement.kotazk.payload.response.auth.UserLoginResponseDto;
import com.taskmanagement.kotazk.service.impl.TestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class TestController {
    @Autowired
    TestService testService = new TestService();
    @PostMapping("/test")
    public ResponseEntity<?> test() {
        return new ResponseEntity<Boolean>(testService.testPost(), HttpStatus.OK);
    }

}
