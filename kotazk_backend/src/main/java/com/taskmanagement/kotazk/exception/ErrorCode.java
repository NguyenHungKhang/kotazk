package com.taskmanagement.kotazk.exception;

public enum ErrorCode {
    NOT_FOUND("E_CM_001", "error.not_found"),
    USER_NOT_FOUND("E_USER_001", "error.user.not_found"),
    INVALID_REQUEST("E_REQ_001", "error.invalid_request"),
    USERNAME_CHANGE_RESTRICTED("E_USER_002", "error.username_change_restricted"),
    EMAIL_NOT_NULL("E_AUTH_001", "error.auth.email_not_null"),
    EMAIL_INVALID_FORMAT("E_AUTH_002", "error.auth.email_invalid_format"),
    PASSWORD_NOT_NULL("E_AUTH_003", "error.auth.password_not_null"),
    PASSWORD_INVALID_FORMAT("E_AUTH_004", "error.auth.password_invalid_format");

    private final String code;
    private final String messageKey;

    ErrorCode(String code, String messageKey) {
        this.code = code;
        this.messageKey = messageKey;
    }

    public String getCode() {
        return code;
    }

    public String getMessageKey() {
        return messageKey;
    }
}

