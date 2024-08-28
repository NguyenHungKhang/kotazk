package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.TaskType;
import com.taskmanagement.kotazk.payload.request.common.RePositionRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.tasktype.TaskTypeRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.common.RePositionResponseDto;
import com.taskmanagement.kotazk.payload.response.project.ProjectResponseDto;
import com.taskmanagement.kotazk.payload.response.tasktype.TaskTypeResponseDto;

import java.util.List;

public interface ITaskTypeService {
    List<TaskType> initialTaskType();
    TaskTypeResponseDto create(TaskTypeRequestDto taskTypeRequestDto);
    TaskTypeResponseDto update(Long id, TaskTypeRequestDto taskTypeRequestDto);
    Boolean delete(Long id);
    Boolean softDelete(Long id);
    RePositionResponseDto rePosition(RePositionRequestDto rePositionRequestDto, Long projectId);
    TaskTypeResponseDto getOne(Long id);
    PageResponse<TaskTypeResponseDto> getPageByWorkSpace(SearchParamRequestDto searchParam, Long projectId);

}
