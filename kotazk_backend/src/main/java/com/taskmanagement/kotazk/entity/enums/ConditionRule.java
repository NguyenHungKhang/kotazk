package com.taskmanagement.kotazk.entity.enums;

public enum ConditionRule {
    RESTRICT_WHO_CAN_MOVE,        // Only allow certain people to move an issue using a particular transition
    SPECIFIC_STATUS_PASSED,       // Only allow an issue to be moved if it has had a specific status
    FIELD_SPECIFIC_VALUE          // Only allow an issue to be moved when a field is a specific value or range of values

}
