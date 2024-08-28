package com.taskmanagement.kotazk.payload.request.tasktype;

import com.taskmanagement.kotazk.payload.request.customization.CustomizationRequestDto;
import com.taskmanagement.kotazk.payload.request.field.FieldRequestDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TaskTypeRequestDto {
    Long projectId;
    String name;
    String description;
    CustomizationRequestDto customization;
    List<FieldRequestDto> fields = new ArrayList<>();
}
