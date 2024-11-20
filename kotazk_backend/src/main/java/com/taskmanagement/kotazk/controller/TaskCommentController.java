package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.task.TaskRequestDto;
import com.taskmanagement.kotazk.payload.request.taskComment.TaskCommentRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.task.TaskResponseDto;
import com.taskmanagement.kotazk.payload.response.taskComment.TaskCommentResponseDto;
import com.taskmanagement.kotazk.service.ITaskCommentService;
import com.taskmanagement.kotazk.service.ITaskService;
import com.taskmanagement.kotazk.service.impl.TaskCommentService;
import com.taskmanagement.kotazk.service.impl.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import static com.taskmanagement.kotazk.config.ConstantConfig.DEFAULT_ENDPOINT_SECURE_PART;

@RestController
@RequestMapping(DEFAULT_ENDPOINT_SECURE_PART + "/task-comment")
public class TaskCommentController {
    @Autowired
    ITaskCommentService taskCommentService = new TaskCommentService();

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public TaskCommentResponseDto create(@Valid @RequestBody TaskCommentRequestDto taskCommentRequestDto) {
        return taskCommentService.create(taskCommentRequestDto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public TaskCommentResponseDto update(@Valid @RequestBody TaskCommentRequestDto taskCommentRequestDto, @PathVariable Long id) {
        return taskCommentService.update(id, taskCommentRequestDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean delete(@PathVariable Long id) {
        return taskCommentService.delete(id);
    }

    @PatchMapping("/soft/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean softDelete(@PathVariable Long id) {
        return taskCommentService.softDelete(id);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public TaskCommentResponseDto getOne(@PathVariable Long id) {
        return taskCommentService.getOne(id);
    }

    @PostMapping("/page/by-task/{taskId}")
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<TaskCommentResponseDto> getPageByTask(@Valid @RequestBody SearchParamRequestDto searchParam, @PathVariable Long taskId) {
        return taskCommentService.getPageByTask(searchParam, taskId);
    }
}
