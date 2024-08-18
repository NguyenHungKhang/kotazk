package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.FilterCriteriaRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.member.MemberRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.member.MemberResponseDto;
import com.taskmanagement.kotazk.payload.response.memberrole.MemberRoleResponseDto;
import com.taskmanagement.kotazk.repository.IMemberRepository;
import com.taskmanagement.kotazk.repository.IMemberRoleRepository;
import com.taskmanagement.kotazk.repository.IProjectRepository;
import com.taskmanagement.kotazk.repository.IWorkSpaceRepository;
import com.taskmanagement.kotazk.service.IMemberService;
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
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class MemberService implements IMemberService {

    @Autowired
    private IMemberRepository memberRepository;
    @Autowired
    private IMemberRoleRepository memberRoleRepository;
    @Autowired
    private IWorkSpaceRepository workSpaceRepository;
    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private TimeUtil timeUtil;
    @Autowired
    BasicSpecificationUtil<Member> specificationUtil = new BasicSpecificationUtil<>();

    @Override
    public MemberResponseDto create(MemberRequestDto member, Boolean systemExec) {
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = null;
        Project project = null;

        if(member.getMemberFor().equals(EntityBelongsTo.WORK_SPACE)) {
            if (member.getWorkSpaceId() != null) {
                workSpace = workSpaceRepository.findById(member.getWorkSpaceId())
                        .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", member.getWorkSpaceId()));
            }
        } else if(member.getMemberFor().equals(EntityBelongsTo.PROJECT)) {
            if (member.getProjectId() != null) {
                project = projectRepository.findById(member.getProjectId())
                        .orElseThrow(() -> new ResourceNotFoundException("Project", "id", member.getProjectId()));
            }
        } else
            throw new CustomException("Invalid Input!");

        if(!systemExec)
            checkMemberStatusAndPermission(
                    currentUser.getId(),
                    workSpace != null ? workSpace.getId() : null,
                    project != null ? project.getId() : null,
                    MemberStatus.ACTIVE,
                    "INVITE_MEMBER"
                    );

        MemberRole memberRole = memberRoleRepository.findById(member.getMemberRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", member.getMemberRoleId()));

        if (!member.getMemberFor().equals(memberRole.getRoleFor())) {
            throw new CustomException("This member's role is not suitable with this request!");
        }

        // Add check user permission

        Member newMember = ModelMapperUtil.mapOne(member, Member.class);
        newMember.setProject(project);
        newMember.setWorkSpace(workSpace);
        newMember.setRole(memberRole);
        if(!systemExec) newMember.setStatus(MemberStatus.ACTIVE);

        Member savedMember = memberRepository.save(newMember);

        return ModelMapperUtil.mapOne(savedMember, MemberResponseDto.class);
    }

    @Override
    public MemberResponseDto update(Long id, MemberRequestDto member) {
        User currentUser = SecurityUtil.getCurrentUser();

        Member currentMember = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", id));

        // Add check user permission

        if(member.getStatus() != null) currentMember.setStatus(member.getStatus());

        Member savedMember = memberRepository.save(currentMember);

        return ModelMapperUtil.mapOne(savedMember, MemberResponseDto.class);
    }

    @Override
    public Boolean delete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();

        Member currentMember = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", id));

        // Add check user permission

        if(currentMember.getSystemRequired().equals(true))
            throw new CustomException("This member cannot be deleted");


        memberRepository.deleteById(currentMember.getId());
        return true;
    }

    @Override
    public Boolean softDelete(Long id) throws IOException, InterruptedException {
        User currentUser = SecurityUtil.getCurrentUser();
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        Member currentMember = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", id));

        // Add check user permission

        if(currentMember.getSystemRequired().equals(true))
            throw new CustomException("This member cannot be deleted");

        currentMember.setDeletedAt(currentTime);
        memberRepository.deleteById(currentMember.getId());
        return true;
    }

    @Override
    public MemberResponseDto getOne(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        Member currentMember = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", id));

        // Add check user permission
        return ModelMapperUtil.mapOne(currentMember, MemberResponseDto.class);
    }

    @Override
    public PageResponse<MemberResponseDto> getListPage(SearchParamRequestDto searchParam, Long workSpaceId, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Long userId = currentUser.getId();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        // Add check user permission

        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "created_at"));

        Specification<Member> specification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Page<Member> page = memberRepository.findAll(specification, pageable);
        List<MemberResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), MemberResponseDto.class);
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
    public Member checkMemberPermission(Long userId, Long workspaceId, Long projectId, String permission) {
        List<FilterCriteriaRequestDto> filterRequestList = new ArrayList<>();
        FilterCriteriaRequestDto filterRequest = FilterCriteriaRequestDto.builder()
                .key("user.id")
                .operation(FilterOperator.EQUAL)
                .value(userId.toString())
                .build();

        if(projectId != null) {
            FilterCriteriaRequestDto filterForProjectRequest = FilterCriteriaRequestDto.builder()
                    .key("project.id")
                    .operation(FilterOperator.EQUAL)
                    .value(projectId.toString())
                    .build();
            filterRequestList.add(filterForProjectRequest);
        }
        if(workspaceId != null) {
            FilterCriteriaRequestDto filterForWorkspaceRequest = FilterCriteriaRequestDto.builder()
                    .key("workSpace.id")
                    .operation(FilterOperator.EQUAL)
                    .value(workspaceId.toString())
                    .build();
            filterRequestList.add(filterForWorkspaceRequest);
        }

        Specification<Member> specification = specificationUtil.getSpecificationFromFilters(filterRequestList);
        Member currentMember = memberRepository.findOne(specification)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "user id", userId));

        boolean checkPermission = false;
        if(currentMember.getMemberFor().equals(EntityBelongsTo.WORK_SPACE))
            checkPermission = currentMember.getRole().getWorkSpacePermissions().contains(WorkSpacePermission.valueOf(permission));
        else if(currentMember.getMemberFor().equals(EntityBelongsTo.PROJECT))
            checkPermission = currentMember.getRole().getProjectPermissions().contains(ProjectPermission.valueOf(permission));
        else throw new CustomException("Invalid Input!");

        if(!checkPermission) throw new  CustomException("Member does not have this permission");
        return currentMember;
    }

    @Override
    public Member checkMemberStatusAndPermission(Long userId, Long workspaceId, Long projectId, MemberStatus status, String permission) {
        List<FilterCriteriaRequestDto> filterRequestList = new ArrayList<>();
        FilterCriteriaRequestDto filterRequest = FilterCriteriaRequestDto.builder()
                .key("user.id")
                .operation(FilterOperator.EQUAL)
                .value(userId.toString())
                .build();

        if(projectId != null) {
            FilterCriteriaRequestDto filterForProjectRequest = FilterCriteriaRequestDto.builder()
                    .key("project.id")
                    .operation(FilterOperator.EQUAL)
                    .value(projectId.toString())
                    .build();
            filterRequestList.add(filterForProjectRequest);
        }
        if(workspaceId != null) {
            FilterCriteriaRequestDto filterForWorkspaceRequest = FilterCriteriaRequestDto.builder()
                    .key("workSpace.id")
                    .operation(FilterOperator.EQUAL)
                    .value(workspaceId.toString())
                    .build();
            filterRequestList.add(filterForWorkspaceRequest);
        }

        filterRequestList.add(filterRequest);
        Specification<Member> specification = specificationUtil.getSpecificationFromFilters(filterRequestList);
        Member currentMember = memberRepository.findOne(specification)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "user id", userId));

        if(!currentMember.getStatus().equals(status)) throw new CustomException(String.format("Member status: %s", status));

        boolean checkPermission;
        if(currentMember.getMemberFor().equals(EntityBelongsTo.WORK_SPACE))
            checkPermission = currentMember.getRole().getWorkSpacePermissions().contains(WorkSpacePermission.valueOf(permission));
        else if(currentMember.getMemberFor().equals(EntityBelongsTo.PROJECT))
            checkPermission = currentMember.getRole().getProjectPermissions().contains(ProjectPermission.valueOf(permission));
        else throw new CustomException("Invalid Input!");

        if(!checkPermission) throw new  CustomException("Member does not have this permission");
        return currentMember;
    }

    @Override
    public Member checkMemberStatus(Long userId, Long workspaceId, Long projectId, MemberStatus status) {
        List<FilterCriteriaRequestDto> filterRequestList = new ArrayList<>();
        FilterCriteriaRequestDto filterRequest = FilterCriteriaRequestDto.builder()
                .key("user.id")
                .operation(FilterOperator.EQUAL)
                .value(userId.toString())
                .build();

        if(projectId != null) {
            FilterCriteriaRequestDto filterForProjectRequest = FilterCriteriaRequestDto.builder()
                    .key("project.id")
                    .operation(FilterOperator.EQUAL)
                    .value(projectId.toString())
                    .build();
            filterRequestList.add(filterForProjectRequest);
        }
        if(workspaceId != null) {
            FilterCriteriaRequestDto filterForWorkspaceRequest = FilterCriteriaRequestDto.builder()
                    .key("workSpace.id")
                    .operation(FilterOperator.EQUAL)
                    .value(workspaceId.toString())
                    .build();
            filterRequestList.add(filterForWorkspaceRequest);
        }

        Specification<Member> specification = specificationUtil.getSpecificationFromFilters(filterRequestList);
        Member currentMember = memberRepository.findOne(specification)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "user id", userId));

        if(!currentMember.getStatus().equals(status)) throw new  CustomException(String.format("Member status: %s", status));
        return currentMember;
    }
}
