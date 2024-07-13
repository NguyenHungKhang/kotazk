package com.taskmanagement.kotazk.payload.response.error;

public class ErrorResponse {
    private final String errorCode;
    private final String errorMessage;

    public ErrorResponse(String errorCode, String errorMessage) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

    // Getter methods
    public String getErrorCode() {
        return errorCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }
}
