package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.common.RePositionRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.status.StatusRequestDto;
import com.taskmanagement.kotazk.payload.request.task.TaskRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.common.RePositionResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusResponseDto;
import com.taskmanagement.kotazk.payload.response.task.TaskResponseDto;
import com.taskmanagement.kotazk.service.IProjectService;
import com.taskmanagement.kotazk.service.IStatusService;
import com.taskmanagement.kotazk.service.impl.ProjectService;
import com.taskmanagement.kotazk.service.impl.StatusService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static com.taskmanagement.kotazk.config.ConstantConfig.DEFAULT_ENDPOINT_SECURE_PART;

@RestController
@RequestMapping(DEFAULT_ENDPOINT_SECURE_PART + "/status")
public class StatusController {
    @Autowired
    IStatusService statusService = new StatusService();
    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public StatusResponseDto create(@Valid @RequestBody StatusRequestDto statusRequestDto) {
        return statusService.create(statusRequestDto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public StatusResponseDto update(@RequestBody StatusRequestDto statusRequestDto, @PathVariable Long id) {
        return statusService.update(id, statusRequestDto);
    }

    @PostMapping("/save-list/by-project/{projectId}")
    @ResponseStatus(HttpStatus.OK)
    public List<StatusResponseDto> saveList(@Valid @RequestBody List<StatusRequestDto> statusRequestDtos, @PathVariable Long projectId) {
        return statusService.saveList(statusRequestDtos, projectId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public List<Map<String, Long>> delete(@PathVariable Long id) {
        return statusService.delete(id);
    }

    @PatchMapping("/soft/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean softDelete(@PathVariable Long id) {
        return statusService.softDelete(id);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public StatusResponseDto getOne(@PathVariable Long id) {
        return statusService.getOne(id);
    }

    @PatchMapping("/re-position/by-project/{projectId}")
    @ResponseStatus(HttpStatus.OK)
    public RePositionResponseDto rePosition(@Valid @RequestBody RePositionRequestDto rePositionRequestDto, @PathVariable Long projectId) {
        return null;
    }

    @PostMapping("/page/by-project/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<StatusResponseDto> getPageByProject(@Valid @RequestBody SearchParamRequestDto searchParam, @PathVariable Long id) {
        return statusService.getPageByProject(searchParam, id);
    }
}
