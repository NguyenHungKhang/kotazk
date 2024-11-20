package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.task.TaskRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.taskComment.TaskCommentResponseDto;
import com.taskmanagement.kotazk.service.ITaskCommentService;

public class TaskCommentService implements ITaskCommentService {
    @Override
    public TaskCommentResponseDto create(TaskRequestDto taskRequestDto) {
        return null;
    }

    @Override
    public TaskCommentResponseDto update(Long id, TaskRequestDto taskRequestDto) {
        return null;
    }

    @Override
    public Boolean delete(Long id) {
        return null;
    }

    @Override
    public Boolean softDelete(Long id) {
        return null;
    }

    @Override
    public TaskCommentResponseDto getOne(Long id) {
        return null;
    }

    @Override
    public PageResponse<TaskCommentResponseDto> getPageByTask(SearchParamRequestDto searchParam, Long taskId) {
        return null;
    }
}
