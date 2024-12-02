package com.taskmanagement.kotazk.payload.response.priority;

import com.taskmanagement.kotazk.payload.request.customization.CustomizationRequestDto;
import com.taskmanagement.kotazk.payload.response.customization.CustomizationResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class PriorityResponseDto {
    Long id;
    Long projectId;
    CustomizationResponseDto customization;
    String name;
    Long position;
}
