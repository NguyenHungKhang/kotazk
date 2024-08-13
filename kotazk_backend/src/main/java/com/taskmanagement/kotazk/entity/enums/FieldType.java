package com.taskmanagement.kotazk.entity.enums;

public enum FieldType {
    TEXT,              // Text box for single-line text input - Need 1 value, key, characters < 120 or 160.
    TEXT_AREA,        // Text area for multi-line text input - Need 1 value, key, support rich-text type (maybe add LONGTEXT tyoe - can store up to 4GB to entity)
    NUMBER,            // Input for numeric values - Need 1 value, key, support long and double number (
    DATE,              // Date picker for selecting dates - Need 1 value, key, support datetime, need to validate, recevie converted value
    SELECT,            // Dropdown list for selecting a single value - Multi many value, key, multi option, choose 1.
    CHECKBOX,          // Checkbox for toggling options - Multi many value, key, multi option, choose many.
    PEOPLE,            // Field for selecting users - Many value, key, need to verify member after add
}
