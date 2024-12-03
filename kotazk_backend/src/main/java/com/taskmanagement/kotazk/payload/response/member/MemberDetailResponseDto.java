package com.taskmanagement.kotazk.payload.response.member;

import com.taskmanagement.kotazk.entity.MemberRole;
import com.taskmanagement.kotazk.entity.Project;
import com.taskmanagement.kotazk.entity.User;
import com.taskmanagement.kotazk.entity.WorkSpace;
import com.taskmanagement.kotazk.entity.enums.EntityBelongsTo;
import com.taskmanagement.kotazk.entity.enums.MemberStatus;
import com.taskmanagement.kotazk.payload.response.memberrole.MemberRoleResponseDto;
import com.taskmanagement.kotazk.payload.response.memberrole.MemberRoleSummaryResponseDto;
import com.taskmanagement.kotazk.payload.response.project.ProjectResponseDto;
import com.taskmanagement.kotazk.payload.response.project.ProjectSummaryResponseDto;
import com.taskmanagement.kotazk.payload.response.user.UserResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceDetailResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceSummaryResponseDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class MemberDetailResponseDto {
    Long id;
    WorkSpaceDetailResponseDto workSpace;
    ProjectResponseDto project;
    String email;
    UserResponseDto user;
    MemberStatus status;
    EntityBelongsTo memberFor;
    MemberRoleResponseDto role;
    Timestamp createdAt;
    Timestamp updatedAt;
    Timestamp deletedAt;
}
