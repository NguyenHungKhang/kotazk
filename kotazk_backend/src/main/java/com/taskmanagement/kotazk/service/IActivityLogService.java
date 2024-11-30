package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.ActivityLog;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.response.activityLog.ActivityLogResponseDto;

import java.util.List;

public interface IActivityLogService {
    ActivityLog create(ActivityLog activityLog);
    List<ActivityLogResponseDto> getAll(SearchParamRequestDto searchParamRequestDto);
}
