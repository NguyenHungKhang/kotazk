package com.taskmanagement.kotazk.payload.response.status;

import com.taskmanagement.kotazk.payload.response.customization.CustomizationResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatusSummaryResponseDto {
    Long id;
    String name;
    String description;
    CustomizationResponseDto customization;

}
