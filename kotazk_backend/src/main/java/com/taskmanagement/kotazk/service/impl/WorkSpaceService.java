package com.taskmanagement.kotazk.service.impl;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.QWorkSpace;
import com.taskmanagement.kotazk.entity.enums.FilterOperator;
import com.taskmanagement.kotazk.entity.enums.SpaceStatus;
import com.taskmanagement.kotazk.entity.enums.Visibility;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.FilterCriteriaRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.workspace.WorkSpaceRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceDetailResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceSummaryResponseDto;
import com.taskmanagement.kotazk.repository.IWorkSpaceRepository;
import com.taskmanagement.kotazk.service.IWorkSpaceService;
import com.taskmanagement.kotazk.specification.WorkSpaceSpecification;
import com.taskmanagement.kotazk.util.ModelMapperUtil;
import com.taskmanagement.kotazk.util.SecurityUtil;
import com.taskmanagement.kotazk.util.TimeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.*;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
public class WorkSpaceService implements IWorkSpaceService {

    @Autowired
    private IWorkSpaceRepository workSpaceRepository;

    @Autowired
    private TimeUtil timeUtil;

    @Override
    public WorkSpaceDetailResponseDto create(WorkSpaceRequestDto workSpace) {
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace newWorkSpace = ModelMapperUtil.mapOne(workSpace, WorkSpace.class);
        newWorkSpace.setUser(currentUser);

        Customization customization = Customization.builder()
                .avatar(workSpace.getCustomization().getAvatar())
                .backgroundColor(workSpace.getCustomization().getBackgroundColor())
                .fontColor(workSpace.getCustomization().getFontColor())
                .icon(workSpace.getCustomization().getIcon())
                .build();

        newWorkSpace.setCustomization(customization);

        // Chuyển đổi danh sách settings từ WorkSpaceRequestDto sang WorkSpace
        Set<Setting> settings = workSpace.getSettings().stream()
                .map(dto -> {
                    Setting setting = new Setting();
                    setting.setKey(dto.getKey());
                    setting.setValue(dto.getValue());
                    return setting;
                })
                .collect(Collectors.toSet());

        newWorkSpace.setSettings(settings);


        // Lưu WorkSpace vào database
        workSpaceRepository.save(newWorkSpace);

        return ModelMapperUtil.mapOne(newWorkSpace, WorkSpaceDetailResponseDto.class);
    }

    @Override
    public WorkSpaceDetailResponseDto update(Long id, WorkSpaceRequestDto workSpace) {
        WorkSpace currentWorkSpace = workSpaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();

        if (!currentUser.getId().equals(currentWorkSpace.getUser().getId()))
            throw new CustomException("User can not modify this work space!");

        if (workSpace.getName() != null) currentWorkSpace.setName(workSpace.getName());
        if (workSpace.getDescription() != null) currentWorkSpace.setDescription(workSpace.getDescription());
        if (workSpace.getVisibility() != null) currentWorkSpace.setVisibility(workSpace.getVisibility());
        if (workSpace.getStatus() != null) currentWorkSpace.setStatus(workSpace.getStatus());

        if (workSpace.getCustomization() != null) {
            if (workSpace.getCustomization().getAvatar() != null)
                currentWorkSpace.getCustomization().setAvatar(workSpace.getCustomization().getAvatar());
            if (workSpace.getCustomization().getBackgroundColor() != null)
                currentWorkSpace.getCustomization().setBackgroundColor(workSpace.getCustomization().getBackgroundColor());
            if (workSpace.getCustomization().getFontColor() != null)
                currentWorkSpace.getCustomization().setFontColor(workSpace.getCustomization().getFontColor());
            if (workSpace.getCustomization().getIcon() != null)
                currentWorkSpace.getCustomization().setIcon(workSpace.getCustomization().getIcon());
        }

        // Chuyển đổi danh sách settings từ WorkSpaceRequestDto sang WorkSpace
        if (workSpace.getSettings() != null) {
            Set<Setting> settings = workSpace.getSettings().stream()
                    .map(dto -> {
                        Setting setting = new Setting();
                        setting.setKey(dto.getKey());
                        setting.setValue(dto.getValue());
                        return setting;
                    })
                    .collect(Collectors.toSet());
            currentWorkSpace.setSettings(settings);
        }

        workSpaceRepository.save(currentWorkSpace);

        return ModelMapperUtil.mapOne(currentWorkSpace, WorkSpaceDetailResponseDto.class);
    }

    @Override
    public Boolean delete(Long id) {
        WorkSpace currentWorkSpace = workSpaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();


        if (!currentUser.getId().equals(currentWorkSpace.getUser().getId()))
            throw new CustomException("User can not delete this work space!");

        workSpaceRepository.deleteById(currentWorkSpace.getId());
        return true;
    }

    @Override
    public Boolean softDelete(Long id) throws IOException, InterruptedException {
        WorkSpace currentWorkSpace = workSpaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        if (!currentUser.getId().equals(currentWorkSpace.getUser().getId()))
            throw new CustomException("User can not delete this work space!");

        currentWorkSpace.setDeletedAt(currentTime);

        workSpaceRepository.save(currentWorkSpace);
        return true;
    }

    @Override
    public Boolean archived(Long id) throws IOException, InterruptedException {

        WorkSpace currentWorkSpace = workSpaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        if (!currentUser.getId().equals(currentWorkSpace.getUser().getId()))
            throw new CustomException("User can not archive this work space!");

        currentWorkSpace.setArchivedAt(currentTime);

        workSpaceRepository.save(currentWorkSpace);
        return true;
    }

    @Override
    public Boolean restore(Long id) {

        WorkSpace currentWorkSpace = workSpaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();

        if (!currentUser.getId().equals(currentWorkSpace.getUser().getId()))
            throw new CustomException("User can not archive this work space!");

        currentWorkSpace.setArchivedAt(null);

        workSpaceRepository.save(currentWorkSpace);
        return true;
    }

    @Override
    public WorkSpaceDetailResponseDto getDetail(Long id) {
        return null;
    }

    @Override
    public WorkSpaceSummaryResponseDto getSummary(Long id) {
        return null;
    }

    @Override
    public PageResponse<WorkSpaceSummaryResponseDto> getSummaryList(SearchParamRequestDto searchParam, Long pageNum, Long pageSize) {
        Pageable pageable = PageRequest.of(pageNum.intValue(), pageSize.intValue(), Sort.by("id").descending());
        Specification<WorkSpace> specification = buildSpecification(searchParam);
        Page<WorkSpace> page = workSpaceRepository.findAll(specification, pageable);
        List<WorkSpaceSummaryResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), WorkSpaceSummaryResponseDto.class);
        return new PageResponse<>(
                dtoList,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.hasNext(),
                page.hasPrevious()
        );
    }

    @Override
    public PageResponse<WorkSpaceDetailResponseDto> getDetailList(SearchParamRequestDto searchParam, Long pageNum, Long pageSize) {
        Pageable pageable = PageRequest.of(pageNum.intValue(), pageSize.intValue(), Sort.by("id").descending());

        Specification<WorkSpace> specification = buildSpecification(searchParam);

        Page<WorkSpace> page = workSpaceRepository.findAll(specification, pageable);

        List<WorkSpaceDetailResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), WorkSpaceDetailResponseDto.class);

        return new PageResponse<>(
                dtoList,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.hasNext(),
                page.hasPrevious()
        );
    }

    private Specification<WorkSpace> buildSpecification(SearchParamRequestDto searchParam) {
        // Convert SearchParamRequestDto to List<FilterCriteriaRequestDto>
        List<FilterCriteriaRequestDto> filters = searchParam.getFilters(); // Assuming `getFilters()` returns List<FilterCriteriaRequestDto>

        Specification<WorkSpace> specification = Specification.where(null);

        for (FilterCriteriaRequestDto filter : filters) {
            specification = specification.and(WorkSpaceSpecification.filterByCriteria(filter));
        }

        return specification;
    }
}
