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
public class TaskTypeSummaryResponseDto {
    Long id;
    String name;
    String description;
    CustomizationResponseDto customization;
}
