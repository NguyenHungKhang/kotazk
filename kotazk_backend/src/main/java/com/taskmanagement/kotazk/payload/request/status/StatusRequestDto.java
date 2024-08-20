package com.taskmanagement.kotazk.payload.request.status;

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
    Boolean isFromStart;
    Boolean isCompletedStatus;
    Long position;
    String name;
    String description;
}
