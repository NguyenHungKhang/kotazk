package com.taskmanagement.kotazk.payload.response.tasktype;

import com.taskmanagement.kotazk.payload.response.customization.CustomizationResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TaskTypeResponseDto {
    Long id;
    Long projectId;
    Long position;
    String name;
    String description;
    Boolean systemInitial;
    Boolean systemRequired;
    CustomizationResponseDto customization;
}
