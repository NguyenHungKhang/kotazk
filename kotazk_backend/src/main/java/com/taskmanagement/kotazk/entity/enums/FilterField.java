package com.taskmanagement.kotazk.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum FilterField {
    PRIORITY("priority.id"),
    STATUS("status.id"),
    TASK_TYPE("taskType.id"),
    ASSIGNEE("assignee.user.id"),
    CREATOR("creator.user.id"),
    START_AT("startAt"),
    END_AT("endAt"),
    IS_COMPLETED("isCompleted"),
    TIME_ESTIMATE("timeEstimate");

    private final String fieldName;

    // Constructor to initialize the enum with the field name
    FilterField(String fieldName) {
        this.fieldName = fieldName;
    }

    // Getter method to retrieve the field name
    @JsonValue
    public String getFieldName() {
        return fieldName;
    }


}


