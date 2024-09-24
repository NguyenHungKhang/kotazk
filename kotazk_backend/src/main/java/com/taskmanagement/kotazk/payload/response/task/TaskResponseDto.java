package com.taskmanagement.kotazk.payload.response.task;

import com.taskmanagement.kotazk.entity.TaskType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TaskResponseDto {
    Long id;
    String name;
    String description;
    Long projectId;
    Long creatorId;
    Long assigneeId;
    Long reporterId;
    Long statusId;
    Long priorityId;
    Long timeEstimate;
    Long timeTracking;
    Boolean isCompleted;
    Timestamp startAt;
    Timestamp endAt;
    Long taskTypeId;
    Long position;
    Set<Long> collaboratorIds = new HashSet<>();
    Set<TaskLabelResponseDto> labels = new HashSet<>();
}
