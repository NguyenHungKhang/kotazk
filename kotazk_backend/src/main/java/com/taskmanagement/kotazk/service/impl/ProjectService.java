package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.member.MemberRequestDto;
import com.taskmanagement.kotazk.payload.request.project.ProjectRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.project.ProjectResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceSummaryResponseDto;
import com.taskmanagement.kotazk.repository.IProjectRepository;
import com.taskmanagement.kotazk.repository.IWorkSpaceRepository;
import com.taskmanagement.kotazk.service.IMemberRoleService;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.IProjectService;
import com.taskmanagement.kotazk.service.IWorkSpaceService;
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
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Transactional
public class ProjectService implements IProjectService {
    @Autowired
    private IWorkSpaceRepository workSpaceRepository;
    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private IMemberService memberService = new MemberService();
    @Autowired
    private IMemberRoleService memberRoleService = new MemberRoleService();
    @Autowired
    private TimeUtil timeUtil;
    @Autowired
    private final BasicSpecificationUtil<Project> specificationUtil = new BasicSpecificationUtil<>();

    @Override
    public ProjectResponseDto initialProject(ProjectRequestDto project) {
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = workSpaceRepository.findById(project.getWorkSpaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", project.getWorkSpaceId()));
        Member currentMember = memberService.checkMemberStatusAndPermission(
                currentUser.getId(),
                workSpace.getId(),
                null,
                MemberStatus.ACTIVE,
                String.valueOf(WorkSpacePermission.CREATE_PROJECT)
        );

        Project newProject = ModelMapperUtil.mapOne(project, Project.class);
        newProject.setId(null);
        newProject.setMember(currentMember);

        Project savedProject = projectRepository.save(newProject);

        List<MemberRole> memberRoles = memberRoleService.initialMemberRole(null, savedProject.getId());
        Optional<MemberRole> memberRole = memberRoles.stream()
                .filter(item -> Objects.equals(item.getName(), "Admin"))
                .findFirst();
        MemberRequestDto memberRequest = MemberRequestDto.builder()
                .workSpaceId(savedProject.getWorkSpace().getId())
                .projectId(savedProject.getId())
                .systemInitial(true)
                .systemRequired(true)
                .memberRoleId(memberRole.get().getId())
                .memberFor(EntityBelongsTo.PROJECT)
                .userId(currentUser.getId())
                .status(MemberStatus.ACTIVE)
                .build();
        memberService.initialMember(memberRequest);
        return null;
    }

    @Override
    public ProjectResponseDto create(ProjectRequestDto project) {
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = workSpaceRepository.findById(project.getWorkSpaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", project.getWorkSpaceId()));
        Member currentMember = memberService.checkMemberStatusAndPermission(
                currentUser.getId(),
                workSpace.getId(),
                null,
                MemberStatus.ACTIVE,
                String.valueOf(WorkSpacePermission.CREATE_PROJECT)
        );

        Project newProject = ModelMapperUtil.mapOne(project, Project.class);
        newProject.setId(null);
        newProject.setMember(currentMember);

        Project savedProject = projectRepository.save(newProject);
        return ModelMapperUtil.mapOne(savedProject, ProjectResponseDto.class);
    }

    @Override
    public ProjectResponseDto update(Long id, ProjectRequestDto project) {
        Project currentProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("project", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = workSpaceRepository.findById(project.getWorkSpaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", project.getWorkSpaceId()));

        Member currentMember = memberService.checkMemberStatus(currentUser.getId(), workSpace.getId(), currentProject.getId(), MemberStatus.ACTIVE);
        boolean checkPermission = isCheckModifyPermission(currentMember, currentProject);
        if (!checkPermission) throw new CustomException("This user does not have permission for this action");

        if (project.getName() != null) currentProject.setName(project.getName());
        if (project.getDescription() != null) currentProject.setDescription(project.getDescription());
        if (project.getVisibility() != null) currentProject.setVisibility(project.getVisibility());
        if (project.getStatus() != null) currentProject.setStatus(project.getStatus());
        if (project.getIsPinned() != null) currentProject.setIsPinned(project.getIsPinned());

        Project savedProject = projectRepository.save(currentProject);
        return ModelMapperUtil.mapOne(savedProject, ProjectResponseDto.class);
    }

    @Override
    public Boolean delete(Long id) {
        Project currentProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = currentProject.getWorkSpace();

        Member currentMember = memberService.checkMemberStatus(currentUser.getId(), workSpace.getId(), currentProject.getId(), MemberStatus.ACTIVE);
        boolean checkPermission = isCheckDeletePermission(currentMember, currentProject);
        if (!checkPermission) throw new CustomException("This user does not have permission for this action");

        projectRepository.deleteById(currentProject.getId());
        return true;
    }

    @Override
    public Boolean softDelete(Long id) {
        Project currentProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = currentProject.getWorkSpace();
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        Member currentMember = memberService.checkMemberStatus(currentUser.getId(), workSpace.getId(), currentProject.getId(), MemberStatus.ACTIVE);
        boolean checkPermission = isCheckDeletePermission(currentMember, currentProject);
        if (!checkPermission) throw new CustomException("This user does not have permission for this action");

        currentProject.setDeletedAt(currentTime);
        projectRepository.deleteById(currentProject.getId());
        return true;
    }

    @Override
    public Boolean archive(Long id) {
        Project currentProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = currentProject.getWorkSpace();
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        Member currentMember = memberService.checkMemberStatus(currentUser.getId(), workSpace.getId(), currentProject.getId(), MemberStatus.ACTIVE);
        boolean checkPermission = isCheckDeletePermission(currentMember, currentProject);
        if (!checkPermission) throw new CustomException("This user does not have permission for this action");

        currentProject.setArchiveAt(currentTime);
        projectRepository.deleteById(currentProject.getId());
        return true;
    }

    @Override
    public Boolean restore(Long id) {
        Project currentProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = currentProject.getWorkSpace();

        Member currentMember = memberService.checkMemberStatus(currentUser.getId(), workSpace.getId(), currentProject.getId(), MemberStatus.ACTIVE);
        boolean checkPermission = isCheckDeletePermission(currentMember, currentProject);
        if (!checkPermission) throw new CustomException("This user does not have permission for this action");

        currentProject.setArchiveAt(null);
        projectRepository.deleteById(currentProject.getId());
        return true;
    }

    @Override
    public ProjectResponseDto getOne(Long id) {
        Project currentProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = currentProject.getWorkSpace();

        Member currentMember = memberService.checkMemberStatusAndPermission(
                currentUser.getId(),
                workSpace.getId(),
                currentProject.getId(),
                MemberStatus.ACTIVE,
                String.valueOf(ProjectPermission.BROWSE_PROJECT)
        );

        return ModelMapperUtil.mapOne(currentProject, ProjectResponseDto.class);
    }

    @Override
    public PageResponse<ProjectResponseDto> getList(SearchParamRequestDto searchParam) {
        User currentUser = SecurityUtil.getCurrentUser();
        Long userId = currentUser.getId();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "createdAt"));

        Specification<Project> specification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Page<Project> page = projectRepository.findAll(specification, pageable);
        List<ProjectResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), ProjectResponseDto.class);
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

    private static boolean isCheckModifyPermission(Member currentMember, Project currentProject) {
        boolean checkPermission = false;
        if (currentMember.getMemberFor().equals(EntityBelongsTo.WORK_SPACE)) {
            if (currentMember.getRole().getWorkSpacePermissions().contains(WorkSpacePermission.MODIFY_ALL_PROJECT))
                checkPermission = true;
            else if (currentMember.getRole().getWorkSpacePermissions().contains(WorkSpacePermission.MODIFY_OWN_PROJECT))
                if (currentProject.getMember().getId().equals(currentMember.getId()))
                    checkPermission = true;
        } else if (currentMember.getMemberFor().equals(EntityBelongsTo.PROJECT))
            if (currentMember.getRole().getProjectPermissions().contains(ProjectPermission.MODIFY_PROJECT))
                checkPermission = true;
        return checkPermission;
    }

    private static boolean isCheckDeletePermission(Member currentMember, Project currentProject) {
        boolean checkPermission = false;
        if (currentMember.getMemberFor().equals(EntityBelongsTo.WORK_SPACE)) {
            if (currentMember.getRole().getWorkSpacePermissions().contains(WorkSpacePermission.DELETE_ALL_PROJECT))
                checkPermission = true;
            else if (currentMember.getRole().getWorkSpacePermissions().contains(WorkSpacePermission.DELETE_OWN_PROJECT))
                if (currentProject.getMember().getId().equals(currentMember.getId()))
                    checkPermission = true;
        } else if (currentMember.getMemberFor().equals(EntityBelongsTo.PROJECT))
            if (currentMember.getRole().getProjectPermissions().contains(ProjectPermission.DELETE_PROJECT))
                checkPermission = true;
        return checkPermission;
    }

    private static boolean isCheckAccessPermission(Member currentMember, Project currentProject) {
        boolean checkPermission = false;
        if (currentMember.getMemberFor().equals(EntityBelongsTo.WORK_SPACE)) {
            if (currentMember.getRole().getWorkSpacePermissions().contains(WorkSpacePermission.VIEW_PUBLIC_PROJECT)
                    && currentProject.getVisibility().equals(Visibility.PUBLIC))
                checkPermission = true;
            else if (currentMember.getRole().getWorkSpacePermissions().contains(WorkSpacePermission.VIEW_PRIVATE_PROJECT)
                    && currentProject.getVisibility().equals(Visibility.PRIVATE))

                checkPermission = true;
        } else if (currentMember.getMemberFor().equals(EntityBelongsTo.PROJECT))
//            if (currentProject.getMember().getId().equals(currentMember.getId()))
            if (currentMember.getRole().getProjectPermissions().contains(ProjectPermission.BROWSE_PROJECT))
                checkPermission = true;
        return checkPermission;
    }
}
