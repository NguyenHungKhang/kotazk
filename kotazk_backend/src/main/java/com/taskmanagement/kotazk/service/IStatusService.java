package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.status.StatusRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.status.StatusResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusSummaryResponseDto;

import java.io.IOException;

public interface IStatusService {
    StatusResponseDto create(StatusRequestDto status);
    StatusResponseDto update(Long id, StatusRequestDto status);
    Boolean delete(Long id);
    Boolean softDelete(Long id);
    StatusResponseDto getOne(Long id);
    StatusSummaryResponseDto getSummaryOne(Long id);
    PageResponse<StatusResponseDto> getPageOfProject(SearchParamRequestDto searchParam, Long projectId);
    PageResponse<StatusSummaryResponseDto> getSummaryPageOfProject(SearchParamRequestDto searchParam, Long projectId);
}
