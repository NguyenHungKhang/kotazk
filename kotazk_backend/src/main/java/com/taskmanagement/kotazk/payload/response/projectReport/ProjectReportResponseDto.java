package com.taskmanagement.kotazk.payload.response.projectReport;

import com.taskmanagement.kotazk.entity.enums.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ProjectReportResponseDto {
    Long id;
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
    Timestamp createdAt;
    Timestamp updatedAt;
    Timestamp deletedAt;
}
