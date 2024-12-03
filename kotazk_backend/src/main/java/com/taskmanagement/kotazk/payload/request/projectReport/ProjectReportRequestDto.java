package com.taskmanagement.kotazk.payload.request.projectReport;

import com.taskmanagement.kotazk.entity.FilterSetting;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.entity.enums.ProjectXTypeReport;
import com.taskmanagement.kotazk.entity.enums.ProjectSubXTypeReport;
import com.taskmanagement.kotazk.entity.enums.ProjectGroupByReport;
import com.taskmanagement.kotazk.entity.enums.ProjectYTypeReport;
import com.taskmanagement.kotazk.payload.request.common.FilterCriteriaRequestDto;
import com.taskmanagement.kotazk.payload.request.filterSetting.FilterSettingRequestDto;
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
public class ProjectReportRequestDto {
    Long workspaceId;
    Long projectId;
    Long sectionId;
    String name;
    ProjectColorModeReport colorMode;
    ProjectReportType type;
    ProjectXTypeReport xType;
    ProjectSubXTypeReport subXType;
    ProjectGroupByReport groupedBy;
    ProjectYTypeReport yType;
    List<FilterSettingRequestDto> filterSettings = new ArrayList<>();
    Timestamp fromWhen;
    Timestamp toWhen;
    Long between;
}
