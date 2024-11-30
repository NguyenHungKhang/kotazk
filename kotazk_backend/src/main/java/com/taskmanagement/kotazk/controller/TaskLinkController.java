package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.entity.enums.FilterOperator;
import com.taskmanagement.kotazk.payload.request.common.FilterCriteriaRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.response.activityLog.ActivityLogResponseDto;
import com.taskmanagement.kotazk.payload.response.taskLink.TaskLinkResponseDto;
import com.taskmanagement.kotazk.service.IActivityLogService;
import com.taskmanagement.kotazk.service.ITaskLinkService;
import com.taskmanagement.kotazk.service.impl.ActivityLogService;
import com.taskmanagement.kotazk.service.impl.TaskLinkService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

import static com.taskmanagement.kotazk.config.ConstantConfig.DEFAULT_ENDPOINT_SECURE_PART;

@RestController
@RequestMapping(DEFAULT_ENDPOINT_SECURE_PART + "/task-link")
public class TaskLinkController {
    @Autowired
    ITaskLinkService taskLinkService = new TaskLinkService();
    @PostMapping("/list/by-first-task/{taskId}")
    @ResponseStatus(HttpStatus.OK)
    public List<TaskLinkResponseDto> getListByFirstTask(@Valid @PathVariable Long taskId) {
        SearchParamRequestDto searchParam = new SearchParamRequestDto();
        FilterCriteriaRequestDto filterCriteriaRequestDto = new FilterCriteriaRequestDto();
        filterCriteriaRequestDto.setKey("firstTask.id");
        filterCriteriaRequestDto.setOperation(FilterOperator.EQUAL);
        filterCriteriaRequestDto.setValue(taskId.toString());
        searchParam.setFilters(Collections.singletonList(filterCriteriaRequestDto));
        return taskLinkService.getAll(searchParam);
    }

    @PostMapping("/list/by-second-task/{taskId}")
    @ResponseStatus(HttpStatus.OK)
    public List<TaskLinkResponseDto> getListBySecondTask(@Valid @PathVariable Long taskId) {
        SearchParamRequestDto searchParam = new SearchParamRequestDto();
        FilterCriteriaRequestDto filterCriteriaRequestDto = new FilterCriteriaRequestDto();
        filterCriteriaRequestDto.setKey("secondTask.id");
        filterCriteriaRequestDto.setOperation(FilterOperator.EQUAL);
        filterCriteriaRequestDto.setValue(taskId.toString());
        searchParam.setFilters(Collections.singletonList(filterCriteriaRequestDto));
        return taskLinkService.getAll(searchParam);
    }
}
