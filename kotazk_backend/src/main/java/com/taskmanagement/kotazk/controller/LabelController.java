package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.label.LabelRequestDto;
import com.taskmanagement.kotazk.payload.request.priority.PriorityRequestDto;
import com.taskmanagement.kotazk.payload.request.task.TaskRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.label.LabelResponseDto;
import com.taskmanagement.kotazk.payload.response.priority.PriorityResponseDto;
import com.taskmanagement.kotazk.payload.response.task.TaskResponseDto;
import com.taskmanagement.kotazk.service.ILabelService;
import com.taskmanagement.kotazk.service.ITaskService;
import com.taskmanagement.kotazk.service.impl.LabelService;
import com.taskmanagement.kotazk.service.impl.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.taskmanagement.kotazk.config.ConstantConfig.DEFAULT_ENDPOINT_SECURE_PART;

@RestController
@RequestMapping(DEFAULT_ENDPOINT_SECURE_PART + "/label")
public class LabelController {
    @Autowired
    ILabelService labelService = new LabelService();

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public LabelResponseDto create(@RequestBody LabelRequestDto labelRequestDto) {
        return labelService.create(labelRequestDto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public LabelResponseDto update(@Valid @RequestBody LabelRequestDto labelRequestDto, @PathVariable Long id) {
        return labelService.update(id, labelRequestDto);
    }

    @PostMapping("/save-list/by-project/{projectId}")
    @ResponseStatus(HttpStatus.OK)
    public List<LabelResponseDto> saveList(@Valid @RequestBody List<LabelRequestDto> labelRequestDtos, @PathVariable Long projectId) {
        return labelService.saveList(labelRequestDtos, projectId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public List<Long> delete(@PathVariable Long id) {
        return labelService.delete(id);
    }

    @PatchMapping("/soft/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean softDelete(@PathVariable Long id) {
        return labelService.softDelete(id);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public LabelResponseDto getOne(@PathVariable Long id) {
        return labelService.getOne(id);
    }

    @PostMapping("/page/by-project/{projectId}")
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<LabelResponseDto> getDetailPage(@Valid @RequestBody SearchParamRequestDto searchParam, @PathVariable Long projectId) {
        return labelService.getPageByProject(searchParam, projectId);
    }
}
