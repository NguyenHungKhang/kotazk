package com.taskmanagement.kotazk.payload.request.projectReport;

import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.entity.enums.ProjectXTypeReport;
import com.taskmanagement.kotazk.entity.enums.ProjectSubXTypeReport;
import com.taskmanagement.kotazk.entity.enums.ProjectGroupByReport;
import com.taskmanagement.kotazk.entity.enums.ProjectYTypeReport;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ProjectReportRequestDto {
    Long workspaceId;
    Long projectId;
    String name;
    ProjectColorModeReport colorMode;
    ProjectReportType type;
    ProjectXTypeReport xType;
    ProjectSubXTypeReport subXType;
    ProjectGroupByReport groupedBy;
    ProjectYTypeReport yType;
    Timestamp fromWhen;
    Timestamp toWhen;
    Long between;
}
