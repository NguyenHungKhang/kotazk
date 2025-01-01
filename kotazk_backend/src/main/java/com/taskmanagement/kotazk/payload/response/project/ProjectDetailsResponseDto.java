package com.taskmanagement.kotazk.payload.response.project;

import com.taskmanagement.kotazk.entity.Section;
import com.taskmanagement.kotazk.entity.enums.ProjectStatus;
import com.taskmanagement.kotazk.entity.enums.Visibility;
import com.taskmanagement.kotazk.payload.response.label.LabelResponseDto;
import com.taskmanagement.kotazk.payload.response.member.MemberResponseDto;
import com.taskmanagement.kotazk.payload.response.memberrole.MemberRoleResponseDto;
import com.taskmanagement.kotazk.payload.response.priority.PriorityResponseDto;
import com.taskmanagement.kotazk.payload.response.section.SectionResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusResponseDto;
import com.taskmanagement.kotazk.payload.response.tasktype.TaskTypeResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceSummaryResponseDto;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ProjectDetailsResponseDto {
    Long id;
    WorkSpaceSummaryResponseDto workSpace;
    MemberResponseDto member;
    String cover;
    String name;
    Boolean isPinned;
    Long position;
    String description;
    ProjectStatus status;
    Visibility visibility;
    Timestamp createdAt;
    Timestamp updatedAt;
    Timestamp deletedAt;

    List<MemberResponseDto> members = new ArrayList<>();
//    List<MemberRoleResponseDto> memberRoles = new ArrayList<>();
    List<StatusResponseDto> statuses = new ArrayList<>();
    List<SectionResponseDto> sections = new ArrayList<>();
    List<TaskTypeResponseDto> taskTypes = new ArrayList<>();
    List<PriorityResponseDto> priorities = new ArrayList<>();
    List<LabelResponseDto> labels = new ArrayList<>();
}
