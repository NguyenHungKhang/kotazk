package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.payload.request.workspace.WorkSpaceRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceDetailResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceSummaryResponseDto;

public interface IWorkSpaceService {
    WorkSpaceDetailResponseDto create(WorkSpaceRequestDto workSpace);
    WorkSpaceDetailResponseDto update(Long id, WorkSpaceRequestDto workSpace);
    Boolean delete(Long id);
    Boolean softDelete(Long id);
    Boolean archived(Long id);
    Boolean restore(Long id);
    WorkSpaceDetailResponseDto getDetail(Long id);
    WorkSpaceSummaryResponseDto getSummary(Long id);
    PageResponse<WorkSpaceSummaryResponseDto> getSummaryList(Long pageNum, Long pageSize);
    PageResponse<WorkSpaceDetailResponseDto> getDetailList(Long pageNum, Long pageSize);
}
