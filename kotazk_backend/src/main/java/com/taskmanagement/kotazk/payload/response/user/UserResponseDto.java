package com.taskmanagement.kotazk.payload.response.user;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserResponseDto {
    Long id;
    String firstName;
    String lastName;
    String bio;
    String avatar;
    String email;
}
