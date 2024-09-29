package com.taskmanagement.kotazk.payload.request.status;

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
public class StatusRequestDto {
    Long projectId;
    Boolean isFromAny;
    CustomizationRequestDto customization;
    Boolean isFromStart;
    Boolean isCompletedStatus;
    Long position;
    String name;
    String description;
    RePositionRequestDto rePositionReq;
}
