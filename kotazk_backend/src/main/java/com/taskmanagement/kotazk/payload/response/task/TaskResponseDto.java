package com.taskmanagement.kotazk.payload.response.task;

import com.taskmanagement.kotazk.payload.response.activityLog.ActivityLogResponseDto;
import com.taskmanagement.kotazk.payload.response.attachment.AttachmentResponseDto;
import com.taskmanagement.kotazk.payload.response.label.LabelResponseDto;
import com.taskmanagement.kotazk.payload.response.member.MemberResponseDto;
import com.taskmanagement.kotazk.payload.response.priority.PriorityResponseDto;
import com.taskmanagement.kotazk.payload.response.project.ProjectResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusResponseDto;
import com.taskmanagement.kotazk.payload.response.tasktype.TaskTypeResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TaskResponseDto {
    Long id;
    String name;
    String description;
    ProjectResponseDto project;
    Long parentTaskId;
    Long creatorId;
    MemberResponseDto assignee;
    Long reporterId;
    StatusResponseDto status;
    PriorityResponseDto priority;
    Float timeEstimate;
    Long timeTracking;
    Boolean isCompleted;
    Timestamp startAt;
    Timestamp endAt;
    TaskTypeResponseDto taskType;
    Long position;
    Set<Long> collaboratorIds = new HashSet<>();
    Set<LabelResponseDto> labels = new HashSet<>();
    List<TaskResponseDto> childTasks = new ArrayList<>();
    List<AttachmentResponseDto> attachments = new ArrayList<>();
    List<ActivityLogResponseDto> activityLogs = new ArrayList<>();
}
