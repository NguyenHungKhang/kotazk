package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.project.ProjectRequestDto;
import com.taskmanagement.kotazk.payload.request.task.TaskRequestDto;
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
        try {
            return taskService.create(taskRequestDto);
        } catch (Exception e)
        {
            e.printStackTrace();
        }
        return null;
    }
}
