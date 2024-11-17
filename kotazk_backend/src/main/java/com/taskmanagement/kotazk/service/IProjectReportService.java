package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.ProjectReport;
import com.taskmanagement.kotazk.payload.request.common.RePositionRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.projectReport.ProjectReportRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.common.RePositionResponseDto;
import com.taskmanagement.kotazk.payload.response.projectReport.ProjectReportResponseDto;

import java.util.List;

public interface IProjectReportService {
    List<ProjectReport> initialTaskType();
    ProjectReportResponseDto create(ProjectReportRequestDto projectReportRequestDto);
    ProjectReportResponseDto update(Long id, ProjectReportRequestDto projectReportRequestDto);
    Boolean delete(Long id);
    Boolean softDelete(Long id);
    RePositionResponseDto rePosition(RePositionRequestDto rePositionRequestDto, Long projectId);
    ProjectReportResponseDto getOne(Long id);
    PageResponse<ProjectReportResponseDto> getPageBySection(SearchParamRequestDto searchParam, Long sectionId);
    ProjectReportResponseDto previewChart(ProjectReportRequestDto projectReportRequestDto);
}
