package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.payload.request.common.RePositionRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.project.ProjectRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.common.RePositionResponseDto;
import com.taskmanagement.kotazk.payload.response.project.ProjectDetailsResponseDto;
import com.taskmanagement.kotazk.payload.response.project.ProjectResponseDto;
import com.taskmanagement.kotazk.payload.response.project.ProjectSummaryResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceDetailResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceSummaryResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IProjectService {
    ProjectResponseDto initialProject(ProjectRequestDto project);
    ProjectResponseDto create(ProjectRequestDto project);
    ProjectResponseDto update(Long id, ProjectRequestDto project);
    ProjectResponseDto uploadCover(MultipartFile file, Long projectId) throws IOException;
    Boolean delete(Long id);
    Boolean softDelete(Long id);
    Boolean archive(Long id);
    Boolean restore(Long id);
    RePositionResponseDto rePosition(RePositionRequestDto rePositionRequestDto, Long workspaceId);
    ProjectResponseDto getOne(Long id);
    ProjectDetailsResponseDto getDetailsOne(Long id);
    PageResponse<ProjectResponseDto> getPageByWorkSpace(SearchParamRequestDto searchParam, Long workSpaceId);
    PageResponse<ProjectSummaryResponseDto> getSummaryPageByWorkSpace(SearchParamRequestDto searchParam, Long workSpaceId);
}
