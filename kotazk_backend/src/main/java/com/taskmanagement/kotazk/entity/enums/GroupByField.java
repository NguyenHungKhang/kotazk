package com.taskmanagement.kotazk.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum GroupByField {
    PRIORITY("priority"),
    STATUS("status"),
    TASK_TYPE("taskType"),
    ASSIGNEE("assignee"),
    CREATOR("creator"),
    IS_COMPLETED("isCompleted");

    private final String fieldName;

    // Constructor to initialize the enum with the field name
    GroupByField(String fieldName) {
        this.fieldName = fieldName;
    }

    // Getter method to retrieve the field name
    @JsonValue
    public String getFieldName() {
        return fieldName;
    }
}
