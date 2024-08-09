package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.MemberRole;
import com.taskmanagement.kotazk.entity.Project;
import com.taskmanagement.kotazk.entity.User;
import com.taskmanagement.kotazk.entity.WorkSpace;
import com.taskmanagement.kotazk.entity.enums.EntityBelongsTo;
import com.taskmanagement.kotazk.entity.enums.FilterOperator;
import com.taskmanagement.kotazk.entity.enums.Role;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.FilterCriteriaRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.memberrole.MemberRoleRequestDto;
import com.taskmanagement.kotazk.payload.request.memberrole.RepositionMemberRoleRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.memberrole.MemberRoleResponseDto;
import com.taskmanagement.kotazk.repository.IMemberRoleRepository;
import com.taskmanagement.kotazk.repository.IProjectRepository;
import com.taskmanagement.kotazk.repository.IWorkSpaceRepository;
import com.taskmanagement.kotazk.service.IMemberRoleService;
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

import java.io.IOException;
import java.sql.Timestamp;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MemberRoleService implements IMemberRoleService {

    @Autowired
    private IMemberRoleRepository memberRoleRepository;

    @Autowired
    private IWorkSpaceRepository workSpaceRepository;

    @Autowired
    private IProjectRepository projectRepository;

    @Autowired
    private TimeUtil timeUtil;

    @Autowired
    BasicSpecificationUtil<MemberRole> specificationUtil = new BasicSpecificationUtil<>();

    @Override
    public MemberRoleResponseDto create(MemberRoleRequestDto memberRole) {
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = null;
        Project project = null;

        if(memberRole.getRoleFor().equals(EntityBelongsTo.WORK_SPACE)) {
            if (memberRole.getWorkSpaceId() != null) {
                workSpace = workSpaceRepository.findById(memberRole.getWorkSpaceId())
                        .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", memberRole.getWorkSpaceId()));
            }
        } else if(memberRole.getRoleFor().equals(EntityBelongsTo.PROJECT)) {
            if (memberRole.getProjectId() != null) {
                project = projectRepository.findById(memberRole.getProjectId())
                        .orElseThrow(() -> new ResourceNotFoundException("Project", "id", memberRole.getProjectId()));
            }
        } else
            throw new CustomException("Invalid Input!");

        // Add check user permission

        MemberRole newMemberRole = ModelMapperUtil.mapOne(memberRole, MemberRole.class);
        newMemberRole.setProject(project);
        newMemberRole.setWorkSpace(workSpace);

        MemberRole savedMemberRole = memberRoleRepository.save(newMemberRole);

        return ModelMapperUtil.mapOne(savedMemberRole, MemberRoleResponseDto.class);
    }

    @Override
    public MemberRoleResponseDto update(Long id, MemberRoleRequestDto memberRole) {
        User currentUser = SecurityUtil.getCurrentUser();

        MemberRole currentMemberRole = memberRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member role", "id", id));

        // Add check user permission

        if(memberRole.getName() != null) currentMemberRole.setName(memberRole.getName());
        if(memberRole.getDescription() != null) currentMemberRole.setDescription(memberRole.getDescription());
        if(!memberRole.getProjectPermissions().isEmpty()) currentMemberRole.setProjectPermissions(memberRole.getProjectPermissions());
        if(!memberRole.getWorkSpacePermissions().isEmpty()) currentMemberRole.setWorkSpacePermissions(memberRole.getWorkSpacePermissions());

        MemberRole savedMemberRole = memberRoleRepository.save(currentMemberRole);

        return ModelMapperUtil.mapOne(savedMemberRole, MemberRoleResponseDto.class);
    }

    @Override
    public Boolean delete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();

        MemberRole currentMemberRole = memberRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member role", "id", id));

        // Add check user permission

        if(currentMemberRole.getSystemRequired().equals(true))
            throw new CustomException("This role cannot be deleted");


        memberRoleRepository.deleteById(currentMemberRole.getId());
        return true;
    }

    @Override
    public Boolean softDelete(Long id) throws IOException, InterruptedException {
        User currentUser = SecurityUtil.getCurrentUser();
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        MemberRole currentMemberRole = memberRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member role", "id", id));

        // Add check user permission

        if(currentMemberRole.getSystemRequired().equals(true))
            throw new CustomException("This role cannot be deleted");

        currentMemberRole.setDeletedAt(currentTime);
        memberRoleRepository.deleteById(currentMemberRole.getId());
        return true;
    }

    @Override
    public MemberRoleResponseDto getOne(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        MemberRole currentMemberRole = memberRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member role", "id", id));

        // Add check user permission
        return ModelMapperUtil.mapOne(currentMemberRole, MemberRoleResponseDto.class);
    }

    @Override
    public Boolean rePosition(RepositionMemberRoleRequestDto repositionMemberRole) {
        User currentUser = SecurityUtil.getCurrentUser();
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        MemberRole currentMemberRole = memberRoleRepository.findById(repositionMemberRole.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Member role", "id", repositionMemberRole.getRoleId()));

        Specification<MemberRole> specification = null;
        FilterCriteriaRequestDto filterRequest = null;

        // Add check user permission
        if (currentMemberRole.getRoleFor().equals(EntityBelongsTo.WORK_SPACE))
            filterRequest = FilterCriteriaRequestDto.builder()
                    .filterKey("workspace.id")
                    .operation(FilterOperator.EQUAL)
                    .value(currentMemberRole.getWorkSpace().getId().toString())
                    .build();
        else if (currentMemberRole.getRoleFor().equals(EntityBelongsTo.PROJECT))
            filterRequest = FilterCriteriaRequestDto.builder()
                    .filterKey("project.id")
                    .operation(FilterOperator.EQUAL)
                    .value(currentMemberRole.getWorkSpace().getId().toString())
                    .build();
        else throw new CustomException("Something wrong!");

        specification = specificationUtil.getSpecificationFromFilters(Collections.singletonList(filterRequest));
        List<MemberRole> memberRoles = memberRoleRepository.findAll(specification);

        Long oldPosition = currentMemberRole.getPosition();
        memberRoles.stream().peek(memberRole -> {
            Long changePositionValue = 0L;
            if(oldPosition < repositionMemberRole.getNewPosition()) {
                if (memberRole.getPosition() > oldPosition && memberRole.getPosition() <= repositionMemberRole.getNewPosition())
                    changePositionValue = 1L;
            } else if (oldPosition > repositionMemberRole.getNewPosition()) {
                if (memberRole.getPosition() < oldPosition && memberRole.getPosition() >= repositionMemberRole.getNewPosition())
                    changePositionValue = -1L;
            }
            memberRole.setPosition(memberRole.getPosition() + changePositionValue);
        }).collect(Collectors.toSet());

        // Return list position

        return null;
    }

    @Override
    public PageResponse<MemberRoleResponseDto> getList(SearchParamRequestDto searchParam, Long workSpaceId, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Long userId = currentUser.getId();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        // Add check user permission

        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "created_at"));

        Specification<MemberRole> specification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Page<MemberRole> page = memberRoleRepository.findAll(specification, pageable);
        List<MemberRoleResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), MemberRoleResponseDto.class);
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
