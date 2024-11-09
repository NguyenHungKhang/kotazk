package com.taskmanagement.kotazk.payload.response.project;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ProjectSummaryResponseDto {
    Long id;
//    WorkSpaceSummaryResponseDto workSpace;
//    MemberResponseDto member;
    String name;
    Boolean isPinned;
    Long position;
//    String description;
//    ProjectStatus status;
//    Visibility visibility;
}
