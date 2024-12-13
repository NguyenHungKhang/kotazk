package com.taskmanagement.kotazk.payload.response.task;

import com.taskmanagement.kotazk.payload.response.attachment.AttachmentResponseDto;
import com.taskmanagement.kotazk.payload.response.label.LabelResponseDto;
import com.taskmanagement.kotazk.payload.response.member.MemberSummaryResponseDto;
import com.taskmanagement.kotazk.payload.response.priority.PrioritySummaryResponseDto;
import com.taskmanagement.kotazk.payload.response.project.ProjectResponseDto;
import com.taskmanagement.kotazk.payload.response.project.ProjectSummaryResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusSummaryResponseDto;
import com.taskmanagement.kotazk.payload.response.tasktype.TaskTypeSummaryResponseDto;
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
public class UserTaskResponseDto {
    Long id;
    String name;
    String description;
    ProjectResponseDto project;
    TaskSummaryResponseDto parentTask;
    Long creatorId;
    MemberSummaryResponseDto assignee;
    StatusSummaryResponseDto status;
    PrioritySummaryResponseDto priority;
    Float timeEstimate;
    Boolean isCompleted;
    Timestamp startAt;
    Timestamp endAt;
    TaskTypeSummaryResponseDto taskType;
    Long position;
    Set<LabelResponseDto> labels = new HashSet<>();
    List<TaskSummaryResponseDto> childTasks = new ArrayList<>();
    List<AttachmentResponseDto> attachments = new ArrayList<>();
}
