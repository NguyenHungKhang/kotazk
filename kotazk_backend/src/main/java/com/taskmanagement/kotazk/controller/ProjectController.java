package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.project.ProjectRequestDto;
import com.taskmanagement.kotazk.payload.request.workspace.WorkSpaceRequestDto;
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

@RestController
@RequestMapping("/project")
public class ProjectController {
    @Autowired
    IProjectService projectService = new ProjectService();

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponseDto create(@Valid @RequestBody ProjectRequestDto projectRequest) {
        return projectService.initialProject(projectRequest);
    }

}
