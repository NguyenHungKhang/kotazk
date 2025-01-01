package com.taskmanagement.kotazk.payload.request.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserChangePasswordRequestDto {
    String oldPassword;
    String newPassword;
}
