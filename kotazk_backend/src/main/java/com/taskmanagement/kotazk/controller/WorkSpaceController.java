package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.workspace.WorkSpaceRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceDetailResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceSummaryResponseDto;
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
        try {
            return workSpaceService.getSummaryList(searchParam);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return null;
    }

    @PostMapping("/page/detail")
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<WorkSpaceDetailResponseDto> getDetailPage(@Valid @RequestBody SearchParamRequestDto searchParam) {
        return workSpaceService.getDetailList(searchParam);
    }
}
