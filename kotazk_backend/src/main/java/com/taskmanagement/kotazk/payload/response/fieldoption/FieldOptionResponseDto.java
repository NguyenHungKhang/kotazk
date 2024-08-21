package com.taskmanagement.kotazk.payload.response.fieldoption;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class FieldOptionResponseDto {
    Long id;
    Long fieldId;
    Boolean systemInitial;
    Boolean systemRequired;
    String value;
    String description;
    Long position;
    String isDefaultValue;
}
