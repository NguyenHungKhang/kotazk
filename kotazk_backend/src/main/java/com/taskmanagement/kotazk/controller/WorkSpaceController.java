package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.workspace.WorkSpaceRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.project.ProjectResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceDetailResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceSummaryResponseDto;
import com.taskmanagement.kotazk.service.INotificationService;
import com.taskmanagement.kotazk.service.IWorkSpaceService;
import com.taskmanagement.kotazk.service.impl.NotificationService;
import com.taskmanagement.kotazk.service.impl.WorkSpaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/secure/workspace")
public class WorkSpaceController {

    @Autowired
    IWorkSpaceService workSpaceService = new WorkSpaceService();

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public WorkSpaceDetailResponseDto create(@Valid @RequestBody WorkSpaceRequestDto workSpaceRequest) {
        return workSpaceService.initialWorkSpace(workSpaceRequest);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public WorkSpaceDetailResponseDto update(@RequestBody WorkSpaceRequestDto workSpaceRequest, @PathVariable Long id) {
        return workSpaceService.update(id, workSpaceRequest);
    }

    @PutMapping("/upload-cover/{id}")
    @ResponseStatus(HttpStatus.OK)
    public WorkSpaceDetailResponseDto uploadCover(@Valid @RequestBody MultipartFile file, @PathVariable Long id) throws IOException {
        return workSpaceService.uploadCover(file, id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean delete(@PathVariable Long id) {
        return workSpaceService.delete(id);
    }

    @PatchMapping("/soft/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean softDelete(@PathVariable Long id)  {
        return workSpaceService.softDelete(id);
    }

    @PatchMapping("/archive/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean archive(@PathVariable Long id) {
        return workSpaceService.archive(id);
    }

    @PatchMapping("/restore/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean restore(@PathVariable Long id) {
        return workSpaceService.restore(id);
    }

    @GetMapping("/detail/{id}")
    @ResponseStatus(HttpStatus.OK)
    public WorkSpaceDetailResponseDto getDetailOne(@PathVariable Long id) {
        return workSpaceService.getDetail(id);
    }

    @GetMapping("/summary/{id}")
    @ResponseStatus(HttpStatus.OK)
    public WorkSpaceSummaryResponseDto getSummaryOne(@PathVariable Long id) {
        return workSpaceService.getSummary(id);
    }

    @PostMapping("/page/summary")
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<WorkSpaceSummaryResponseDto> getSummaryPage(@Valid @RequestBody SearchParamRequestDto searchParam) {
            return workSpaceService.getSummaryList(searchParam);
    }

    @PostMapping("/page/detail")
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<WorkSpaceDetailResponseDto> getDetailPage(@Valid @RequestBody SearchParamRequestDto searchParam) {
        return workSpaceService.getDetailList(searchParam);
    }
}
