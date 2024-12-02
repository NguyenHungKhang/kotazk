package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.response.activityLog.ActivityLogResponseDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.label.LabelResponseDto;
import com.taskmanagement.kotazk.service.IActivityLogService;
import com.taskmanagement.kotazk.service.impl.ActivityLogService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.taskmanagement.kotazk.config.ConstantConfig.DEFAULT_ENDPOINT_SECURE_PART;

@RestController
@RequestMapping(DEFAULT_ENDPOINT_SECURE_PART + "/activity-log")
public class ActivityLogController {

    @Autowired
    IActivityLogService activityLogService = new ActivityLogService();
    @PostMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<ActivityLogResponseDto> getAll(@Valid @RequestBody SearchParamRequestDto searchParam) {
        return activityLogService.getAll(searchParam);
    }
}
