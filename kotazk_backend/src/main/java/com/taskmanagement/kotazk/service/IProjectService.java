package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.project.ProjectRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.project.ProjectResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceDetailResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceSummaryResponseDto;

import java.io.IOException;

public interface IProjectService {
    ProjectResponseDto create(ProjectRequestDto project);
    ProjectResponseDto update(Long id, ProjectRequestDto project);
    Boolean delete(Long id);
    Boolean softDelete(Long id) throws IOException, InterruptedException;
    Boolean archive(Long id) throws IOException, InterruptedException;
    Boolean restore(Long id);
    ProjectResponseDto getOne(Long id);
    PageResponse<ProjectResponseDto> getList(SearchParamRequestDto searchParam);
}
