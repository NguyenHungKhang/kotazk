package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.MemberRole;
import com.taskmanagement.kotazk.entity.Project;
import com.taskmanagement.kotazk.entity.User;
import com.taskmanagement.kotazk.entity.WorkSpace;
import com.taskmanagement.kotazk.entity.enums.*;
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
import java.util.*;
import java.util.stream.Collectors;

import static com.taskmanagement.kotazk.config.ConstantConfig.*;

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
    private IMemberService memberService =  new MemberService();
    @Autowired
    private TimeUtil timeUtil;

    @Autowired
    BasicSpecificationUtil<MemberRole> specificationUtil = new BasicSpecificationUtil<>();

    @Override
    public MemberRoleResponseDto create(MemberRoleRequestDto memberRole, Boolean systemExec) {
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

        if(!systemExec)
            memberService.checkMemberStatusAndPermission(
                    currentUser.getId(),
                    workSpace != null ? workSpace.getId() : null,
                    project != null ? project.getId() : null,
                    MemberStatus.ACTIVE,
                    "MANAGE_ROLE_SETTING"
            );
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
                    .key("workspace.id")
                    .operation(FilterOperator.EQUAL)
                    .value(currentMemberRole.getWorkSpace().getId().toString())
                    .build();
        else if (currentMemberRole.getRoleFor().equals(EntityBelongsTo.PROJECT))
            filterRequest = FilterCriteriaRequestDto.builder()
                    .key("project.id")
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
    public PageResponse<MemberRoleResponseDto> getListPage(SearchParamRequestDto searchParam, Long workSpaceId, Long projectId) {
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

    @Override
    public List<MemberRole> initialMemberRole(Long workSpaceId, Long projectId) {
        Optional<WorkSpace> workSpace = workSpaceId != null ? workSpaceRepository.findById(workSpaceId) : Optional.empty();
        Optional<Project> project = projectId != null ? projectRepository.findById(projectId) : Optional.empty();

        // Quyền WorkSpace và Project tùy thuộc vào điều kiện null
        EnumSet<WorkSpacePermission> workSpacePermissions = workSpace.isPresent() ? EnumSet.allOf(WorkSpacePermission.class) : EnumSet.noneOf(WorkSpacePermission.class);
        EnumSet<ProjectPermission> projectPermissions = project.isPresent() ? EnumSet.allOf(ProjectPermission.class) : EnumSet.noneOf(ProjectPermission.class);

        MemberRole adminRole = MemberRole.builder()
                .name("Admin") // Tên vai trò
                .description("This role has all permissions") // Mô tả
                .workSpacePermissions(workSpacePermissions) // Quyền WorkSpace nếu có
                .projectPermissions(projectPermissions) // Quyền Project nếu có
                .workSpace(workSpace.orElse(null))
                .project(project.orElse(null))
                .systemInitial(true)
                .systemRequired(true)
                .position(1L)
                .roleFor(project.isEmpty() ? EntityBelongsTo.WORK_SPACE : EntityBelongsTo.PROJECT) // Hoặc PROJECT tùy thuộc vào mục đích
                .build();

        // Tạo quyền Editor với các quyền workspace và project tương ứng
        Set<WorkSpacePermission> editorWorkSpacePermissions = workSpace.isPresent() ? DEFAULT_EDITOR_ROLE_PERMISSION : EnumSet.noneOf(WorkSpacePermission.class);
        Set<ProjectPermission> editorProjectPermissions = project.isPresent() ? DEFAULT_PROJECT_EDITOR_PERMISSIONS : EnumSet.noneOf(ProjectPermission.class);

        MemberRole editorRole = MemberRole.builder()
                .name("Editor") // Tên vai trò
                .description("This role can edit something in workspace") // Mô tả
                .workSpacePermissions(editorWorkSpacePermissions) // Quyền WorkSpace nếu có
                .projectPermissions(editorProjectPermissions) // Quyền Project nếu có
                .workSpace(workSpace.orElse(null))
                .project(project.orElse(null))
                .systemInitial(true)
                .systemRequired(true)
                .position(2L)
                .roleFor(project.isEmpty() ? EntityBelongsTo.WORK_SPACE : EntityBelongsTo.PROJECT) // Hoặc PROJECT tùy thuộc vào mục đích
                .build();

        // Tạo quyền Guest với các quyền workspace và project tương ứng
        Set<WorkSpacePermission> guestWorkSpacePermissions = workSpace.isPresent() ? DEFAULT_GUEST_ROLE_PERMISSION : EnumSet.noneOf(WorkSpacePermission.class);
        Set<ProjectPermission> guestProjectPermissions = project.isPresent() ? DEFAULT_PROJECT_GUEST_PERMISSIONS : EnumSet.noneOf(ProjectPermission.class);

        MemberRole guestRole = MemberRole.builder()
                .name("Guest") // Tên vai trò
                .description("This role can view something in workspace") // Mô tả
                .workSpacePermissions(guestWorkSpacePermissions) // Quyền WorkSpace nếu có
                .projectPermissions(guestProjectPermissions) // Quyền Project nếu có
                .workSpace(workSpace.orElse(null))
                .project(project.orElse(null))
                .systemInitial(true)
                .systemRequired(true)
                .position(3L)
                .roleFor(project.isEmpty() ? EntityBelongsTo.WORK_SPACE : EntityBelongsTo.PROJECT) // Hoặc PROJECT tùy thuộc vào mục đích
                .build();

        return memberRoleRepository.saveAll(List.of(adminRole, editorRole, guestRole));
    }
}
