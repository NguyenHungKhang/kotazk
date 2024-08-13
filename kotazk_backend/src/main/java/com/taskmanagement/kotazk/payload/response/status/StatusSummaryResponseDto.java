package com.taskmanagement.kotazk.payload.response.status;

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
    Long projectId;
    Long position;
    String name;
    String description;

}
