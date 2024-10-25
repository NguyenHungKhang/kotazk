package com.taskmanagement.kotazk.payload.response.project;

import com.taskmanagement.kotazk.entity.enums.ProjectStatus;
import com.taskmanagement.kotazk.entity.enums.Visibility;
import com.taskmanagement.kotazk.payload.request.customization.CustomizationRequestDto;
import com.taskmanagement.kotazk.payload.response.member.MemberResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceSummaryResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ProjectResponseDto {
    Long id;
    WorkSpaceSummaryResponseDto workSpace;
    MemberResponseDto member;
    String name;
    Boolean isPinned;
    Long position;
    String description;
    ProjectStatus status;
    Visibility visibility;
}
