package com.taskmanagement.kotazk.entity.enums;

public enum FilterOperator {
    EQUALS,            // "="
    NOT_EQUALS,        // "!="
    GREATER_THAN,      // ">"
    LESS_THAN,         // "<"
    GREATER_THAN_OR_EQUAL, // ">="
    LESS_THAN_OR_EQUAL,    // "<="
    CONTAINS,          // "contains"
    NOT_CONTAINS,      // "not contains"
    IN,                // "in"
    NOT_IN,            // "not in"
    IS_EMPTY,          // "is empty"
    IS_NOT_EMPTY,      // "is not empty"
    BETWEEN,           // "between"
    BEFORE,            // "before"
    AFTER;             // "after"
}