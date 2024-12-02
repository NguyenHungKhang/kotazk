package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.section.SectionRequestDto;
import com.taskmanagement.kotazk.payload.request.status.StatusRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.project.ProjectResponseDto;
import com.taskmanagement.kotazk.payload.response.section.SectionResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusResponseDto;
import com.taskmanagement.kotazk.service.ISectionService;
import com.taskmanagement.kotazk.service.impl.SectionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import static com.taskmanagement.kotazk.config.ConstantConfig.*;

@RestController
@RequestMapping(DEFAULT_ENDPOINT_SECURE_PART + "/section")
public class SectionController {
    @Autowired
    ISectionService sectionService = new SectionService();

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public SectionResponseDto create(@Valid @RequestBody SectionRequestDto sectionRequestDto) {
        return sectionService.create(sectionRequestDto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public SectionResponseDto update(@RequestBody SectionRequestDto sectionRequestDto, @PathVariable Long id) {
        return sectionService.update(id, sectionRequestDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean delete(@PathVariable Long id) {
        return sectionService.delete(id);
    }


    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public SectionResponseDto getOne(@PathVariable Long id) {
        return sectionService.getOne(id);
    }

    @PostMapping("/page/by-project/{projectId}")
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<SectionResponseDto> getDetailPage(@Valid @RequestBody SearchParamRequestDto searchParam, @PathVariable Long projectId) {
        return sectionService.getPageByProject(searchParam, projectId);
    }
}
