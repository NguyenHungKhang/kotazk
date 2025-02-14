package com.taskmanagement.kotazk.payload.response.projectReport;

import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.payload.response.filterSetting.FilterSettingResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ProjectReportResponseDto {
    Long id;
    Long workspaceId;
    Long projectId;
    Long sectionId;
    Long position;
    String name;
    ProjectColorModeReport colorMode = ProjectColorModeReport.X_COLOR;
    ProjectReportType type;
    ProjectXTypeReport xType;
    ProjectSubXTypeReport subXType;
    ProjectGroupByReport groupedBy;
    ProjectYTypeReport yType;
    Timestamp fromWhen;
    Timestamp toWhen;
    Timestamp createdAt;
    Timestamp updatedAt;
    Timestamp deletedAt;

    Double numberValue;
    List<FilterSettingResponseDto> filterSettings = new ArrayList<>();
    List<ProjectReportItemResponseDto> items = new ArrayList<>();
    List<ProjectReportItemNameAndColorResponseDto> colorsAndNames = new ArrayList<>();
}
