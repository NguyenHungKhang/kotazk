package com.taskmanagement.kotazk.payload;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class CustomResponse {
    private String message;
    private boolean success;
    public CustomResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }
}