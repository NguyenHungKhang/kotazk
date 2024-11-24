package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.payload.request.common.RePositionRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.task.TaskRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.common.RePositionResponseDto;
import com.taskmanagement.kotazk.payload.response.task.TaskResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceDetailResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceSummaryResponseDto;

public interface ITaskService {
    TaskResponseDto create(TaskRequestDto taskRequestDto);
    TaskResponseDto update(Long id, TaskRequestDto taskRequestDto);
    Boolean delete(Long id);
    Boolean softDelete(Long id);
    RePositionResponseDto rePosition(RePositionRequestDto rePositionRequestDto, Long projectId);
    TaskResponseDto getOne(Long id);
    PageResponse<TaskResponseDto> getPageByProject(SearchParamRequestDto searchParam, Long projectId);
    PageResponse<TaskResponseDto> getToday(Long projectId);
}
