package com.taskmanagement.kotazk.payload.response.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserLoginResponseDto {
    String access_token;
    String refresh_token;
}
