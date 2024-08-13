package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.MemberStatus;
import com.taskmanagement.kotazk.entity.enums.ProjectPermission;
import com.taskmanagement.kotazk.entity.enums.WorkSpacePermission;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.status.StatusRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.project.ProjectResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusSummaryResponseDto;
import com.taskmanagement.kotazk.repository.ICustomizationRepository;
import com.taskmanagement.kotazk.repository.IProjectRepository;
import com.taskmanagement.kotazk.repository.IStatusRepository;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.IStatusService;
import com.taskmanagement.kotazk.util.BasicSpecificationUtil;
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

import java.sql.Timestamp;
import java.util.List;

@Service
@Transactional
public class StatusService implements IStatusService {

    @Autowired
    private IStatusRepository statusRepository;
    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private IMemberService memberService = new MemberService();

    @Autowired
    private ICustomizationRepository customizationRepository;
    @Autowired
    private TimeUtil timeUtil;
    @Autowired
    private final BasicSpecificationUtil<Status> specificationUtil = new BasicSpecificationUtil<>();

    @Override
    public StatusResponseDto create(StatusRequestDto status) {
        User currentUser = SecurityUtil.getCurrentUser();
        Project project = projectRepository.findById(status.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", status.getProjectId()));

        Member currentMember = memberService.checkMemberStatusAndPermission(
                currentUser.getId(),
                project.getWorkSpace().getId(),
                project.getId(),
                MemberStatus.ACTIVE,
                String.valueOf(ProjectPermission.EDIT_WORKFLOW));

        Status newStatus = ModelMapperUtil.mapOne(status, Status.class);
        newStatus.setId(null);
        newStatus.setProject(project);

        Status savedStatus = statusRepository.save(newStatus);
        return ModelMapperUtil.mapOne(savedStatus, StatusResponseDto.class);
    }

    @Override
    public StatusResponseDto update(Long id, StatusRequestDto status) {
        User currentUser = SecurityUtil.getCurrentUser();

        Status currentStatus = statusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Status", "id", id));
        if (currentStatus.getDeletedAt() != null) throw new ResourceNotFoundException("Status", "id", id);

        Project currentProject = currentStatus.getProject();

        Member currentMember = memberService.checkMemberStatusAndPermission(
                currentUser.getId(),
                currentProject.getWorkSpace().getId(),
                currentProject.getId(),
                MemberStatus.ACTIVE,
                String.valueOf(ProjectPermission.EDIT_WORKFLOW));

        if (status.getName() != null) currentStatus.setName(status.getName());
        if (status.getDescription() != null) currentStatus.setDescription(status.getDescription());
        if (status.getIsFromAny() != null) currentStatus.setIsFromAny(status.getIsFromAny());
        if (status.getIsFromStart() != null) currentStatus.setIsFromStart(status.getIsFromStart());

        Status savedStatus = statusRepository.save(currentStatus);
        return ModelMapperUtil.mapOne(savedStatus, StatusResponseDto.class);
    }

    @Override
    public Boolean delete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        Status currentStatus = statusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Status", "id", id));
        Project currentProject = currentStatus.getProject();
        Member currentMember = memberService.checkMemberStatusAndPermission(
                currentUser.getId(),
                currentProject.getWorkSpace().getId(),
                currentProject.getId(),
                MemberStatus.ACTIVE,
                String.valueOf(ProjectPermission.EDIT_WORKFLOW));

        statusRepository.deleteById(currentStatus.getId());
        return true;
    }

    @Override
    public Boolean softDelete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        Status currentStatus = statusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Status", "id", id));
        Project currentProject = currentStatus.getProject();
        Member currentMember = memberService.checkMemberStatusAndPermission(
                currentUser.getId(),
                currentProject.getWorkSpace().getId(),
                currentProject.getId(),
                MemberStatus.ACTIVE,
                String.valueOf(ProjectPermission.EDIT_WORKFLOW));
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        currentStatus.setDeletedAt(currentTime);
        statusRepository.save(currentStatus);
        return true;
    }

    @Override
    public StatusResponseDto getOne(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        Status currentStatus = statusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Status", "id", id));
        if (currentStatus.getDeletedAt() != null) throw new ResourceNotFoundException("Status", "id", id);

        Member currentMember = memberService.checkMemberStatusAndPermission(
                currentUser.getId(),
                currentStatus.getProject().getWorkSpace().getId(),
                currentStatus.getProject().getId(),
                MemberStatus.ACTIVE,
                String.valueOf(ProjectPermission.BROWSE_PROJECT)
        );

        return ModelMapperUtil.mapOne(currentStatus, StatusResponseDto.class);
    }

    @Override
    public StatusSummaryResponseDto getSummaryOne(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        Status currentStatus = statusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Status", "id", id));
        if (currentStatus.getDeletedAt() != null) throw new ResourceNotFoundException("Status", "id", id);

        Member currentMember = memberService.checkMemberStatusAndPermission(
                currentUser.getId(),
                currentStatus.getProject().getWorkSpace().getId(),
                currentStatus.getProject().getId(),
                MemberStatus.ACTIVE,
                String.valueOf(ProjectPermission.BROWSE_PROJECT)
        );

        return ModelMapperUtil.mapOne(currentStatus, StatusSummaryResponseDto.class);
    }

    @Override
    public PageResponse<StatusResponseDto> getPageOfProject(SearchParamRequestDto searchParam, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        Member currentMember = memberService.checkMemberStatusAndPermission(
                currentUser.getId(),
                project.getWorkSpace().getId(),
                project.getId(),
                MemberStatus.ACTIVE,
                String.valueOf(ProjectPermission.BROWSE_PROJECT));


        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "createdAt"));

        Specification<Status> specification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Page<Status> page = statusRepository.findAll(specification, pageable);
        List<StatusResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), StatusResponseDto.class);
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
    public PageResponse<StatusSummaryResponseDto> getSummaryPageOfProject(SearchParamRequestDto searchParam, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        Member currentMember = memberService.checkMemberStatusAndPermission(
                currentUser.getId(),
                project.getWorkSpace().getId(),
                project.getId(),
                MemberStatus.ACTIVE,
                String.valueOf(ProjectPermission.BROWSE_PROJECT));


        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "createdAt"));

        Specification<Status> specification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Page<Status> page = statusRepository.findAll(specification, pageable);
        List<StatusSummaryResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), StatusSummaryResponseDto.class);
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
}
