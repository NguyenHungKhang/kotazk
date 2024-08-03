package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.workspace.WorkSpaceRequestDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceDetailResponseDto;
import com.taskmanagement.kotazk.service.IWorkSpaceService;
import com.taskmanagement.kotazk.service.impl.WorkSpaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/work-space")
@RequiredArgsConstructor
public class WorkSpaceController {

    @Autowired
    IWorkSpaceService workSpaceService = new WorkSpaceService();

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public WorkSpaceDetailResponseDto create(@Valid @RequestBody WorkSpaceRequestDto workSpaceRequest) {
        return workSpaceService.create(workSpaceRequest);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public WorkSpaceDetailResponseDto update(@Valid @RequestBody WorkSpaceRequestDto workSpaceRequest, @PathVariable Long id) {
        return workSpaceService.update(id, workSpaceRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean delete(@PathVariable Long id) {
        return workSpaceService.delete(id);
    }

    @PatchMapping("/soft/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean softDelete(@PathVariable Long id) throws IOException, InterruptedException {
        return workSpaceService.softDelete(id);
    }

    @PatchMapping("/archive/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean archive(@PathVariable Long id) throws IOException, InterruptedException {
        return workSpaceService.archived(id);
    }

    @PatchMapping("/restore/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean restore(@PathVariable Long id) {
        return workSpaceService.restore(id);
    }
}
