package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.WorkSpace;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.workspace.WorkSpaceRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.project.ProjectResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceDetailResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceSummaryResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IWorkSpaceService {
    WorkSpaceDetailResponseDto initialWorkSpace(WorkSpaceRequestDto workSpace);
//    WorkSpace create(WorkSpaceRequestDto workSpace);
    WorkSpaceDetailResponseDto update(Long id, WorkSpaceRequestDto workSpace);
    WorkSpaceDetailResponseDto uploadCover(MultipartFile file, Long workspaceId) throws IOException;
    Boolean delete(Long id);
    Boolean softDelete(Long id);
    Boolean archive(Long id);
    Boolean restore(Long id);
    WorkSpaceDetailResponseDto getDetail(Long id);
    WorkSpaceSummaryResponseDto getSummary(Long id);
    PageResponse<WorkSpaceSummaryResponseDto> getSummaryList(SearchParamRequestDto searchParam);
    PageResponse<WorkSpaceDetailResponseDto> getDetailList(SearchParamRequestDto searchParam);
}
