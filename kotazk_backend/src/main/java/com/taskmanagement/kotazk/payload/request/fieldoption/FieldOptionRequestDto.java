package com.taskmanagement.kotazk.payload.request.fieldoption;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class FieldOptionRequestDto {
    Long fieldId;
    String value;
    String description;
    Boolean isDefaultValue;
}
