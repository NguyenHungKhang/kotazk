package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.common.RePositionRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.tasktype.TaskTypeRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.common.RePositionResponseDto;
import com.taskmanagement.kotazk.payload.response.tasktype.TaskTypeResponseDto;
import com.taskmanagement.kotazk.service.ITaskTypeService;
import com.taskmanagement.kotazk.service.impl.TaskTypeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static com.taskmanagement.kotazk.config.ConstantConfig.DEFAULT_ENDPOINT_SECURE_PART;

@RestController
@RequestMapping(DEFAULT_ENDPOINT_SECURE_PART + "/taskType")
public class TaskTypeController {
    @Autowired
    ITaskTypeService taskTypeService = new TaskTypeService();
    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public TaskTypeResponseDto create(@Valid @RequestBody TaskTypeRequestDto taskTypeRequestDto) {
        return taskTypeService.create(taskTypeRequestDto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public TaskTypeResponseDto update(@Valid @RequestBody TaskTypeRequestDto taskTypeRequestDto, @PathVariable Long id) {
        return taskTypeService.update(id, taskTypeRequestDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public List<Map<String, Object>> delete(@PathVariable Long id) {
        return taskTypeService.delete(id);
    }

    @PatchMapping("/soft/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean softDelete(@PathVariable Long id) {
        return taskTypeService.softDelete(id);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public TaskTypeResponseDto getOne(@PathVariable Long id) {
        return taskTypeService.getOne(id);
    }

    @PatchMapping("/re-position/by-project/{projectId}")
    @ResponseStatus(HttpStatus.OK)
    public RePositionResponseDto rePosition(@Valid @RequestBody RePositionRequestDto rePositionRequestDto, @PathVariable Long projectId) {
        return null;
    }

    @PostMapping("/page/by-project/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<TaskTypeResponseDto> getPageByProject(@Valid @RequestBody SearchParamRequestDto searchParam, @PathVariable Long id) {
        return taskTypeService.getPageByProject(searchParam, id);
    }
}
