package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
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

@RestController
@RequestMapping("/status")
public class StatusController {
    @Autowired
    IStatusService statusService = new StatusService();

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public StatusResponseDto getOne(@PathVariable Long id) {
        return statusService.getOne(id);
    }

    @PostMapping("/page/by-project/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<StatusResponseDto> getPageByProject(@Valid @RequestBody SearchParamRequestDto searchParam, @PathVariable Long id) {
        return statusService.getPageByProject(searchParam, id);
    }
}
