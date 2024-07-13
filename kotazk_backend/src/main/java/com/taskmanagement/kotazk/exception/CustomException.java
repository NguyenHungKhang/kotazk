package com.taskmanagement.kotazk.exception;

public class CustomException extends RuntimeException {
    private final String messageKey;

    public CustomException(String messageKey) {
        super(messageKey);
        this.messageKey = messageKey;
    }

    public String getMessageKey() {
        return messageKey;
    }
}
