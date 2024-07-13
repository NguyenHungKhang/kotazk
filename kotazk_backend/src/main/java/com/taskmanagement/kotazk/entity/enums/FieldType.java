package com.taskmanagement.kotazk.entity.enums;

public enum FieldType {
    TEXT,              // Text box for single-line text input
    TEXT_AREA,        // Text area for multi-line text input
    NUMBER,            // Input for numeric values
    DATE,              // Date picker for selecting dates
    BOOLEAN,           // Checkbox for true/false values
    SELECT,            // Dropdown list for selecting a single value
    MULTI_SELECT,      // Dropdown list for selecting multiple values
    RADIO_BUTTON,      // Group of radio buttons for selecting one option
    CHECKBOX,          // Checkbox for toggling options
    USER_PICKER,       // Field for selecting users
    GROUP_PICKER,      // Field for selecting user groups
    VERSION_PICKER,    // Field for selecting versions
    COMPONENT_PICKER,  // Field for selecting components
    PRIORITY_PICKER,   // Field for selecting priority levels
    LABELS,            // Field for adding labels/tags
    ATTACHMENT,        // Field for file attachments
    CUSTOM_FIELD       // Field for any custom-defined types
}
