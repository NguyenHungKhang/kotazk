package com.taskmanagement.kotazk.payload.response.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserSummaryResponseDto {
    Long id;
    String firstName;
    String lastName;
    String avatar;
    String email;
}
