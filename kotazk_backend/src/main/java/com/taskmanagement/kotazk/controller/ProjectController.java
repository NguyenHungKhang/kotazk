package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.project.ProjectRequestDto;
import com.taskmanagement.kotazk.payload.request.workspace.WorkSpaceRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.project.ProjectResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceDetailResponseDto;
import com.taskmanagement.kotazk.service.IProjectService;
import com.taskmanagement.kotazk.service.IWorkSpaceService;
import com.taskmanagement.kotazk.service.impl.ProjectService;
import com.taskmanagement.kotazk.service.impl.WorkSpaceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/project")
public class ProjectController {
    @Autowired
    IProjectService projectService = new ProjectService();

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponseDto create(@Valid @RequestBody ProjectRequestDto projectRequest) {
        try {
            return projectService.initialProject(projectRequest);
        } catch (Exception e)
        {
            e.printStackTrace();
        }
        return null;
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ProjectResponseDto update(@Valid @RequestBody ProjectRequestDto projectRequest,  @PathVariable Long id) {
        return projectService.update(id, projectRequest);
    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean delete(@PathVariable Long id) {
        return projectService.delete(id);
    }

    @PatchMapping("/soft/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean softDelete(@PathVariable Long id) {
        return projectService.softDelete(id);
    }

    @PatchMapping("/archive/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean archive(@PathVariable Long id) {
        return projectService.archive(id);
    }

    @PatchMapping("/restore/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean restore(@PathVariable Long id) {
        return projectService.restore(id);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ProjectResponseDto getOne(@PathVariable Long id) {
        return projectService.getOne(id);
    }

    @PostMapping("/page/by-work-space/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<ProjectResponseDto> getDetailPage(@Valid @RequestBody SearchParamRequestDto searchParam, @PathVariable Long id) {
        return projectService.getPageByWorkSpace(searchParam, id);
    }
}
