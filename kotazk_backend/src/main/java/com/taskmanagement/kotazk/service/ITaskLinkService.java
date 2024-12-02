package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.task.TaskRequestDto;
import com.taskmanagement.kotazk.payload.request.taskLink.TaskLinkRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.task.TaskResponseDto;
import com.taskmanagement.kotazk.payload.response.taskLink.TaskLinkResponseDto;

import java.util.List;

public interface ITaskLinkService {
    TaskLinkResponseDto save(TaskLinkRequestDto taskLinkRequestDto);
    Boolean delete(Long id);
    List<TaskLinkResponseDto> getAll(SearchParamRequestDto searchParam);
}
