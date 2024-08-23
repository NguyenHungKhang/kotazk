package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.project.ProjectRequestDto;
import com.taskmanagement.kotazk.payload.request.task.TaskRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.project.ProjectResponseDto;
import com.taskmanagement.kotazk.payload.response.task.TaskResponseDto;
import com.taskmanagement.kotazk.service.ITaskService;
import com.taskmanagement.kotazk.service.impl.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/task")
public class TaskController {
    @Autowired
    ITaskService taskService = new TaskService();

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponseDto create(@Valid @RequestBody TaskRequestDto taskRequestDto) {
        return taskService.create(taskRequestDto);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public TaskResponseDto getOne(@PathVariable Long id) {
        return taskService.getOne(id);
    }

    @PostMapping("/page/by-project/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<TaskResponseDto> getDetailPage(@Valid @RequestBody SearchParamRequestDto searchParam, @PathVariable Long id) {
        return taskService.getPageByProject(searchParam, id);
    }
}
