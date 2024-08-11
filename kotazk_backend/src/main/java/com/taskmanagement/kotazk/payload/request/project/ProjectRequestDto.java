package com.taskmanagement.kotazk.payload.request.project;

import com.taskmanagement.kotazk.entity.enums.ProjectStatus;
import com.taskmanagement.kotazk.entity.enums.Visibility;
import com.taskmanagement.kotazk.payload.request.customization.CustomizationRequestDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ProjectRequestDto {
    Long workSpaceId;
    CustomizationRequestDto customization;
    String name;
    Boolean isPinned;
    Long position;
    String description;
    ProjectStatus status;
    Visibility visibility;
}
