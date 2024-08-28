package com.taskmanagement.kotazk.payload.response.label;

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
public class LabelResponseDto {
    Long id;
    Long workSpaceId;
    Long projectId;
    CustomizationResponseDto customization;
    String name;
}
