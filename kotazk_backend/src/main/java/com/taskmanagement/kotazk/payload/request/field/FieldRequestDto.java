package com.taskmanagement.kotazk.payload.request.field;

import com.taskmanagement.kotazk.entity.enums.FieldType;
import com.taskmanagement.kotazk.payload.request.fieldoption.FieldOptionRequestDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class FieldRequestDto {
    Long taskTypeId;
    String name;
    String description;
    String defaultValue;
    Boolean isRequired;
    Boolean isHideWhenEmpty;
    FieldType type;
    List<FieldOptionRequestDto> fieldOptions;
}
