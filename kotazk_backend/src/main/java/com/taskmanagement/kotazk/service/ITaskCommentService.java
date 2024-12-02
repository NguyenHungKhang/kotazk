package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.task.TaskRequestDto;
import com.taskmanagement.kotazk.payload.request.taskComment.TaskCommentRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.status.StatusResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusSummaryResponseDto;
import com.taskmanagement.kotazk.payload.response.taskComment.TaskCommentResponseDto;

public interface ITaskCommentService {
    TaskCommentResponseDto create(TaskCommentRequestDto taskCommentRequestDto);
    TaskCommentResponseDto update(Long id, TaskCommentRequestDto taskCommentRequestDto);
    Boolean delete(Long id);
    Boolean softDelete(Long id);
    TaskCommentResponseDto getOne(Long id);
    PageResponse<TaskCommentResponseDto> getPageByTask(SearchParamRequestDto searchParam, Long taskId);
}
