package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.Status;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.status.StatusRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.status.StatusResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusSummaryResponseDto;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface IStatusService {
    List<Status> initialStatus();
    StatusResponseDto create(StatusRequestDto status);
    StatusResponseDto update(Long id, StatusRequestDto status);
    List<StatusResponseDto> saveList(List<StatusRequestDto> statuses, Long projectId);
    List<Map<String, Long>> delete(Long id);
    Boolean softDelete(Long id);
    StatusResponseDto getOne(Long id);
    StatusSummaryResponseDto getSummaryOne(Long id);
    PageResponse<StatusResponseDto> getPageByProject(SearchParamRequestDto searchParam, Long projectId);
    PageResponse<StatusSummaryResponseDto> getSummaryPageOfProject(SearchParamRequestDto searchParam, Long projectId);
}
