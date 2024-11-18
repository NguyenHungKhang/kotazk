package com.taskmanagement.kotazk.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum SortField {
    PRIORITY("priority.position"),
    STATUS("status.position"),
    TASK_TYPE("taskType.position"),
    ASSIGNEE("assignee.user.lastName"),
    CREATOR("creator.user.lastName"),
    START_AT("startAt"),
    END_AT("endAt"),
    TIME_ESTIMATE("timeEstimate");

    private final String fieldName;

    // Constructor to initialize the enum with the field name
    SortField(String fieldName) {
        this.fieldName = fieldName;
    }

    // Getter method to retrieve the field name
    @JsonValue
    public String getFieldName() {
        return fieldName;
    }
}
