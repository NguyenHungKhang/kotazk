package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.priority.PriorityRequestDto;
import com.taskmanagement.kotazk.payload.request.task.TaskRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.priority.PriorityResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusResponseDto;
import com.taskmanagement.kotazk.payload.response.task.TaskResponseDto;
import com.taskmanagement.kotazk.service.IPriorityService;
import com.taskmanagement.kotazk.service.IStatusService;
import com.taskmanagement.kotazk.service.impl.PriorityService;
import com.taskmanagement.kotazk.service.impl.StatusService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.taskmanagement.kotazk.config.ConstantConfig.DEFAULT_ENDPOINT_SECURE_PART;

@RestController
@RequestMapping(DEFAULT_ENDPOINT_SECURE_PART + "/priority")
public class PriorityController {
    @Autowired
    IPriorityService priorityService = new PriorityService();

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public PriorityResponseDto create(@Valid @RequestBody PriorityRequestDto priorityRequestDto) {
        return priorityService.create(priorityRequestDto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public PriorityResponseDto update(@Valid @RequestBody PriorityRequestDto priorityRequestDto, @PathVariable Long id) {
        return priorityService.update(id, priorityRequestDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public List<Long> delete(@PathVariable Long id) {
        return priorityService.delete(id);
    }

    @PatchMapping("/soft/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean softDelete(@PathVariable Long id) {
        return priorityService.softDelete(id);
    }


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
