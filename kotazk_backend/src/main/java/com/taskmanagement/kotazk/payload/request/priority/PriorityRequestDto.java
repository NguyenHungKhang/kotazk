package com.taskmanagement.kotazk.payload.request.priority;

import com.taskmanagement.kotazk.payload.request.common.RePositionRequestDto;
import com.taskmanagement.kotazk.payload.request.customization.CustomizationRequestDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class PriorityRequestDto {
    Long id;
    Long projectId;
    CustomizationRequestDto customization;
    String name;
    RePositionRequestDto rePositionReq;
}
