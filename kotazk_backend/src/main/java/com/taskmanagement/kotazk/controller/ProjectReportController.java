package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.projectReport.ProjectReportRequestDto;
import com.taskmanagement.kotazk.payload.request.status.StatusRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.priority.PriorityResponseDto;
import com.taskmanagement.kotazk.payload.response.projectReport.ProjectReportResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusResponseDto;
import com.taskmanagement.kotazk.service.IProjectReportService;
import com.taskmanagement.kotazk.service.impl.ProjectReportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import static com.taskmanagement.kotazk.config.ConstantConfig.DEFAULT_ENDPOINT_SECURE_PART;

@RestController
@RequestMapping(DEFAULT_ENDPOINT_SECURE_PART + "/project-report")
public class ProjectReportController {
    @Autowired
    IProjectReportService projectReportService = new ProjectReportService();

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectReportResponseDto create(@RequestBody ProjectReportRequestDto projectReportRequestDto) {
        System.out.println(projectReportRequestDto);
        return projectReportService.create(projectReportRequestDto);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ProjectReportResponseDto getOne(@PathVariable Long id) {
        return projectReportService.getOne(id);
    }


    @PostMapping("/page/by-section/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<ProjectReportResponseDto> getPageByProject(@Valid @RequestBody SearchParamRequestDto searchParam, @PathVariable Long id) {
        return projectReportService.getPageBySection(searchParam, id);
    }
}
