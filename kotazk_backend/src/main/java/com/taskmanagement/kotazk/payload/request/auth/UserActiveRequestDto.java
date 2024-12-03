package com.taskmanagement.kotazk.payload.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserActiveRequestDto {
    @Email
    @NotNull
    String email;
    @NotNull
    String otp;
}
