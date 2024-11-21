package com.taskmanagement.kotazk.payload.request.status;

import com.taskmanagement.kotazk.payload.request.common.RePositionRequestDto;
import com.taskmanagement.kotazk.payload.request.customization.CustomizationRequestDto;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatusRequestDto {
    Long id;
    @NotNull(message = "The project ID is required. Please specify which project this status is associated with.")
    Long projectId;
    @NotNull(message = "You must indicate whether this status allows transitions from any other status.")
    Boolean isFromAny;
    @NotNull(message = "Customization details are required. Please provide the necessary design information, such as background color and icon.")
    CustomizationRequestDto customization;
    @NotNull(message = "Please specify whether this status is a starting point in the workflow.")
    Boolean isFromStart;
    @NotNull(message = "You must indicate whether this status represents the completion of the workflow.")
    Boolean isCompletedStatus;
    Long position;
    @NotNull(message = "The name of the status is required. Please provide a unique and descriptive name.")
    String name;
    String description;
    RePositionRequestDto rePositionReq;
}
