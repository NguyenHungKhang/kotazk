package com.taskmanagement.kotazk.exception;

public class ResourceNotFoundException extends RuntimeException {

    private final String entityName;

    public ResourceNotFoundException(String entityName) {
        super();
        this.entityName = entityName;
    }

    public ResourceNotFoundException(String entityName, String message) {
        super(message);
        this.entityName = entityName;
    }

    public ResourceNotFoundException(String entityName, String message, Throwable cause) {
        super(message, cause);
        this.entityName = entityName;
    }

    public String getEntityName() {
        return entityName;
    }
}
