package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.project.ProjectRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.project.ProjectResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceDetailResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceSummaryResponseDto;

import java.io.IOException;

public interface IProjectService {
    ProjectResponseDto initialProject(ProjectRequestDto project);
    ProjectResponseDto create(ProjectRequestDto project);
    ProjectResponseDto update(Long id, ProjectRequestDto project);
    Boolean delete(Long id);
    Boolean softDelete(Long id);
    Boolean archive(Long id);
    Boolean restore(Long id);
    ProjectResponseDto getOne(Long id);
    PageResponse<ProjectResponseDto> getPageByWorkSpace(SearchParamRequestDto searchParam, Long workSpaceId);
}
