package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.Priority;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.priority.PriorityResponseDto;

import java.util.List;

public interface IPriorityService {
    List<Priority> initialPriority();
    PriorityResponseDto getOne(Long id);
    PageResponse<PriorityResponseDto> getPageByProject(SearchParamRequestDto searchParams, Long projectId);
}
