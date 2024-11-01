package com.taskmanagement.kotazk.payload.response.task;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TaskSummaryResponseDto {
    Long id;
    String name;
    Boolean isCompleted;
}
