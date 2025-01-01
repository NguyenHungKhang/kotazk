package com.taskmanagement.kotazk.payload.response.activityLog;

import com.taskmanagement.kotazk.entity.enums.ActivityLogType;
import com.taskmanagement.kotazk.payload.response.user.UserResponseDto;
import com.taskmanagement.kotazk.payload.response.user.UserSummaryResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ActivityLogResponseDto {
    Long id;
    Long workSpaceId;
    Long projectId;
    Long taskId;
    Long sectionId;
    Long memberId;
    UserSummaryResponseDto user;
    Boolean systemInitial;
    Boolean systemRequired;
    String userText;
    String content;
    String firstEntity;
    String secondEntity;
    ActivityLogType type;
    Timestamp createdAt;
    Timestamp updatedAt;
    Timestamp deletedAt;
}
