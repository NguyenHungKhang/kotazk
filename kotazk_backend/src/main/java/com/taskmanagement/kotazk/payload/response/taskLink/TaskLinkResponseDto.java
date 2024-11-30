package com.taskmanagement.kotazk.payload.response.taskLink;

import com.taskmanagement.kotazk.payload.response.task.TaskSummaryResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TaskLinkResponseDto {
    TaskSummaryResponseDto firstTask;
    TaskSummaryResponseDto secondTask;
}
