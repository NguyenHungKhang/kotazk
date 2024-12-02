package com.taskmanagement.kotazk.payload.response.field;

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
public class FieldResponseDto {
    Long id;
    Long projectId;
    Boolean systemInitial;
    Boolean systemRequired;
    String name;
    String description;
    String defaultValue;
    Long position;
    Boolean isRequired;
    Boolean isMultipleChoice;
    Boolean isHideWhenEmpty;
    FieldType type;

}
