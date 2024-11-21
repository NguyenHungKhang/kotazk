package com.taskmanagement.kotazk.payload.request.tasktype;

import com.taskmanagement.kotazk.payload.request.common.RePositionRequestDto;
import com.taskmanagement.kotazk.payload.request.customization.CustomizationRequestDto;
import com.taskmanagement.kotazk.payload.request.field.FieldRequestDto;
import jakarta.validation.constraints.NotNull;
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
    Long id;
    @NotNull
    Long projectId;
    @NotNull
    String name;
    String description;
    @NotNull
    CustomizationRequestDto customization;
    RePositionRequestDto rePositionReq;
}
