package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.workspace.WorkSpaceRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceDetailResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceSummaryResponseDto;

import java.io.IOException;

public interface IWorkSpaceService {
    WorkSpaceDetailResponseDto create(WorkSpaceRequestDto workSpace);
    WorkSpaceDetailResponseDto update(Long id, WorkSpaceRequestDto workSpace);
    Boolean delete(Long id);
    Boolean softDelete(Long id) throws IOException, InterruptedException;
    Boolean archived(Long id) throws IOException, InterruptedException;
    Boolean restore(Long id);
    WorkSpaceDetailResponseDto getDetail(Long id);
    WorkSpaceSummaryResponseDto getSummary(Long id);
    PageResponse<WorkSpaceSummaryResponseDto> getSummaryList(SearchParamRequestDto searchParam, Long pageNum, Long pageSize);
    PageResponse<WorkSpaceDetailResponseDto> getDetailList(SearchParamRequestDto searchParam, Long pageNum, Long pageSize);
}
