package com.taskmanagement.kotazk.payload.response.priority;

import com.taskmanagement.kotazk.payload.response.customization.CustomizationResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class PrioritySummaryResponseDto {
    Long id;
    CustomizationResponseDto customization;
    String name;
}