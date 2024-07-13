package com.taskmanagement.kotazk.payload.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserSignupRequestDto {

    @NotNull(message = "error.auth.first_name_not_null")
    @Size(min = 1, max = 50, message = "error.auth.first_name_invalid_format")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "error.auth.first_name_invalid_characters")
    private String firstName;

    @NotNull(message = "error.auth.last_name_not_null")
    @Size(min = 1, max = 50, message = "error.auth.last_name_invalid_format")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "error.auth.last_name_invalid_characters")
    private String lastName;

    @NotNull(message = "error.auth.email_not_null")
    @Email(message = "error.auth.email_invalid_format")
    private String email;

    @NotNull(message = "error.auth.password_not_null")
    @Size(min = 8, max = 50, message = "error.auth.password_invalid_format")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,50}$", message = "error.auth.password_invalid_format")
    private String password;

    @NotNull(message = "error.auth.retype_password_not_null")
    @Size(min = 8, max = 50, message = "error.auth.retype_password_invalid_format")
    private String retypePassword;
}