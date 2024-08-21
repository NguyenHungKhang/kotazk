package com.taskmanagement.kotazk.payload.request.task;

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
public class TaskRequestDto {
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
    TaskType taskType;
    Set<Long> collaboratorIds = new HashSet<>();
    Set<Long> labelIds = new HashSet<>();
}
