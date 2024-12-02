package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.response.activityLog.ActivityLogResponseDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.status.StatusSummaryResponseDto;
import com.taskmanagement.kotazk.repository.IActivityLogRepository;
import com.taskmanagement.kotazk.repository.IProjectRepository;
import com.taskmanagement.kotazk.repository.ITaskRepository;
import com.taskmanagement.kotazk.repository.IWorkSpaceRepository;
import com.taskmanagement.kotazk.service.IActivityLogService;
import com.taskmanagement.kotazk.util.BasicSpecificationUtil;
import com.taskmanagement.kotazk.util.ModelMapperUtil;
import com.taskmanagement.kotazk.util.SecurityUtil;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class ActivityLogService implements IActivityLogService {
    @Autowired
    private IActivityLogRepository activityLogRepository;
    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private ITaskRepository taskRepository;
    @Autowired
    private IWorkSpaceRepository workSpaceRepository;
    private final BasicSpecificationUtil<ActivityLog> specificationUtil = new BasicSpecificationUtil<>();

    @Override
    public ActivityLog create(ActivityLog activityLog) {
        return null;
    }
    @Override
    public List<ActivityLogResponseDto> getAll(SearchParamRequestDto searchParamRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        Specification<ActivityLog> specification = specificationUtil.getSpecificationFromFilters(searchParamRequestDto.getFilters());
        List<ActivityLog> activityLogs = activityLogRepository.findAll(specification);
        return ModelMapperUtil.mapList(activityLogs, ActivityLogResponseDto.class);
    }
}
