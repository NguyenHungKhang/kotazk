package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.priority.PriorityResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusResponseDto;
import com.taskmanagement.kotazk.service.IPriorityService;
import com.taskmanagement.kotazk.service.IStatusService;
import com.taskmanagement.kotazk.service.impl.PriorityService;
import com.taskmanagement.kotazk.service.impl.StatusService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/priority")
public class PriorityController {
    @Autowired
    IPriorityService priorityService = new PriorityService();

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PriorityResponseDto getOne(@PathVariable Long id) {
        return priorityService.getOne(id);
    }

    @PostMapping("/page/by-project/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<PriorityResponseDto> getPageByProject(@Valid @RequestBody SearchParamRequestDto searchParam, @PathVariable Long id) {
        return priorityService.getPageByProject(searchParam, id);
    }
}
