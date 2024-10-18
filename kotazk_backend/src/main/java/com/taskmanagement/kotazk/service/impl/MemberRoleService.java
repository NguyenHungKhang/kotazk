package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.FilterCriteriaRequestDto;
import com.taskmanagement.kotazk.payload.request.common.RePositionRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.memberrole.MemberRoleRequestDto;
import com.taskmanagement.kotazk.payload.request.memberrole.RepositionMemberRoleRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.common.RePositionResponseDto;
import com.taskmanagement.kotazk.payload.response.memberrole.MemberRoleResponseDto;
import com.taskmanagement.kotazk.repository.IMemberRoleRepository;
import com.taskmanagement.kotazk.repository.IProjectRepository;
import com.taskmanagement.kotazk.repository.IWorkSpaceRepository;
import com.taskmanagement.kotazk.service.IMemberRoleService;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.util.*;
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

import java.io.IOException;
import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

import static com.taskmanagement.kotazk.config.ConstantConfig.*;
import static com.taskmanagement.kotazk.util.RepositionUtil.calculateNewLastPosition;

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
    private IMemberService memberService = new MemberService();
    @Autowired
    private TimeUtil timeUtil;

    @Autowired
    BasicSpecificationUtil<MemberRole> specificationUtil = new BasicSpecificationUtil<>();

    @Override
    public MemberRoleResponseDto create(MemberRoleRequestDto memberRole) {
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = null;
        Project project = null;
        Member currentMember = null;
        Long postion = null;

        if (memberRole.getRoleFor().equals(EntityBelongsTo.WORK_SPACE)) {
            if (memberRole.getWorkSpaceId() != null) {
                workSpace = workSpaceRepository.findById(memberRole.getWorkSpaceId())
                        .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", memberRole.getWorkSpaceId()));
                currentMember = memberService.checkWorkSpaceMember(
                        currentUser.getId(),
                        workSpace.getId(),
                        Collections.singletonList(MemberStatus.ACTIVE),
                        Collections.singletonList(WorkSpacePermission.MANAGE_ROLE),
                        true
                );
                postion = calculateNewLastPosition(workSpace.getMemberRoles().size());
            }
        } else if (memberRole.getRoleFor().equals(EntityBelongsTo.PROJECT)) {
            if (memberRole.getProjectId() != null) {
                project = projectRepository.findById(memberRole.getProjectId())
                        .orElseThrow(() -> new ResourceNotFoundException("Project", "id", memberRole.getProjectId()));
                currentMember = memberService.checkProjectMember(
                        currentUser.getId(),
                        project.getId(),
                        Collections.singletonList(MemberStatus.ACTIVE),
                        Collections.singletonList(ProjectPermission.MANAGE_ROLE),
                        true
                );
                workSpace = project.getWorkSpace();
                postion = calculateNewLastPosition(project.getMemberRoles().size());
            }
        } else
            throw new CustomException("Invalid Input!");

        MemberRole newMemberRole = MemberRole.builder()
                .workSpace(workSpace)
                .project(project)
                .roleFor(memberRole.getRoleFor())
                .name(memberRole.getName())
                .description(memberRole.getDescription())
                .projectPermissions(memberRole.getProjectPermissions())
                .workSpacePermissions(memberRole.getWorkSpacePermissions())
                .position(postion)
                .build();

        MemberRole savedMemberRole = memberRoleRepository.save(newMemberRole);

        return ModelMapperUtil.mapOne(savedMemberRole, MemberRoleResponseDto.class);
    }

    @Override
    public MemberRoleResponseDto update(Long id, MemberRoleRequestDto memberRole) {
        User currentUser = SecurityUtil.getCurrentUser();

        MemberRole currentMemberRole = memberRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member role", "id", id));

        Member currentMember = checkManageRolePermission(currentUser.getId(), currentMemberRole.getRoleFor(), currentMemberRole);

        Optional.ofNullable(memberRole.getName()).ifPresent(currentMemberRole::setName);
        Optional.ofNullable(memberRole.getDescription()).ifPresent(currentMemberRole::setDescription);
        Optional.ofNullable(memberRole.getProjectPermissions())
                .filter(permissions -> !permissions.isEmpty())
                .ifPresent(currentMemberRole::setProjectPermissions);
        Optional.ofNullable(memberRole.getWorkSpacePermissions())
                .filter(permissions -> !permissions.isEmpty())
                .ifPresent(currentMemberRole::setWorkSpacePermissions);

        MemberRole savedMemberRole = memberRoleRepository.save(currentMemberRole);

        return ModelMapperUtil.mapOne(savedMemberRole, MemberRoleResponseDto.class);
    }

    @Override
    public Boolean delete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();

        MemberRole currentMemberRole = memberRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member role", "id", id));

        Member currentMember = checkManageRolePermission(currentUser.getId(), currentMemberRole.getRoleFor(), currentMemberRole);

        if (currentMemberRole.getSystemRequired().equals(true))
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

        Member currentMember = checkManageRolePermission(currentUser.getId(), currentMemberRole.getRoleFor(), currentMemberRole);

        if (currentMemberRole.getSystemRequired().equals(true))
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

        Project project = currentMemberRole.getProject();
        WorkSpace workSpace = currentMemberRole.getWorkSpace();
        Member currentMember = memberService.checkProjectAndWorkspaceBrowserPermission(currentUser, project, workSpace);

        return ModelMapperUtil.mapOne(currentMemberRole, MemberRoleResponseDto.class);
    }

    @Override
    public RePositionResponseDto rePositionByProject(RePositionRequestDto rePositionRequestDto, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        Member currentMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.MANAGE_ROLE),
                true
        );

        Long nextProjectPosition = project.getMemberRoles().stream()
                .filter(memberRole -> memberRole.getId().equals(rePositionRequestDto.getNextItemId()))
                .findFirst()
                .map(MemberRole::getPosition)
                .orElse(null);

        Long previousProjectPosition = project.getMemberRoles().stream()
                .filter(memberRole -> memberRole.getId().equals(rePositionRequestDto.getPreviousItemId()))
                .findFirst()
                .map(MemberRole::getPosition)
                .orElse(null);

        MemberRole currentMemberRole = project.getMemberRoles().stream()
                .filter(memberRole -> memberRole.getId().equals(rePositionRequestDto.getCurrentItemId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Member role", "id", rePositionRequestDto.getCurrentItemId()));

        currentMemberRole.setPosition(RepositionUtil.calculateNewPosition(previousProjectPosition, nextProjectPosition));

        MemberRole savedMemberRole = memberRoleRepository.save(currentMemberRole);

        return RePositionResponseDto.builder()
                .id(savedMemberRole.getId())
                .newPosition(savedMemberRole.getPosition())
                .build();
    }

    @Override
    public RePositionResponseDto rePositionByWorkspace(RePositionRequestDto rePositionRequestDto, Long workspaceId) {
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = workSpaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", workspaceId));

        Member currentMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.MANAGE_ROLE),
                true
        );

        Long nextProjectPosition = workSpace.getMemberRoles().stream()
                .filter(memberRole -> memberRole.getId().equals(rePositionRequestDto.getNextItemId()))
                .findFirst()
                .map(MemberRole::getPosition)
                .orElse(null);

        Long previousProjectPosition = workSpace.getMemberRoles().stream()
                .filter(memberRole -> memberRole.getId().equals(rePositionRequestDto.getPreviousItemId()))
                .findFirst()
                .map(MemberRole::getPosition)
                .orElse(null);

        MemberRole currentMemberRole = workSpace.getMemberRoles().stream()
                .filter(memberRole -> memberRole.getId().equals(rePositionRequestDto.getCurrentItemId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Member role", "id", rePositionRequestDto.getCurrentItemId()));

        currentMemberRole.setPosition(RepositionUtil.calculateNewPosition(previousProjectPosition, nextProjectPosition));

        MemberRole savedMemberRole = memberRoleRepository.save(currentMemberRole);

        return RePositionResponseDto.builder()
                .id(savedMemberRole.getId())
                .newPosition(savedMemberRole.getPosition())
                .build();
    }

    @Override
    public PageResponse<MemberRoleResponseDto> getPageByProject(SearchParamRequestDto searchParam, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Long userId = currentUser.getId();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        WorkSpace workSpace = project.getWorkSpace();
        Member currentMember = memberService.checkProjectAndWorkspaceBrowserPermission(currentUser, project, workSpace);


        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "created_at"));

        Specification<MemberRole> projectSpecification = (Root<MemberRole> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<MemberRole, Project> projectJoin = root.join("project");
            return criteriaBuilder.equal(projectJoin.get("id"), project.getId());
        };

        Specification<MemberRole> filterSpecification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Specification<MemberRole> specification = Specification.where(projectSpecification)
                .and(filterSpecification);

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
    public List<MemberRole> initialMemberRole(Boolean forWorkSpace) {

        // Tạo các MemberRole với thông tin mặc định
        List<MemberRole> roles = List.of(
                createDefaultInitialRole("Admin", forWorkSpace),
                createDefaultInitialRole("Editor", forWorkSpace),
                createDefaultInitialRole("Guest", forWorkSpace)
        );

        return roles;
    }

    // Utility methods

    // Hàm phụ trợ để tạo MemberRole với thông tin mặc định
    private MemberRole createDefaultInitialRole(String roleName, Boolean forWorkSpace) {
        return MemberRole.builder()
                .name(roleName)
                .description(roleName + " role description")
                .workSpacePermissions(forWorkSpace ? (Set<WorkSpacePermission>) getDefaultInitialPermissions(roleName, "workspace") : EnumSet.noneOf(WorkSpacePermission.class))
                .projectPermissions(!forWorkSpace ? (Set<ProjectPermission>) getDefaultInitialPermissions(roleName, "project") : EnumSet.noneOf(ProjectPermission.class))
                .systemInitial(true)
                .systemRequired(true)
                .position(getDefaultInitialPosition(roleName))
                .roleFor(forWorkSpace ? EntityBelongsTo.WORK_SPACE : EntityBelongsTo.PROJECT)
                .build();
    }

    // Hàm phụ trợ để lấy quyền mặc định của vai trò
    private Set<?> getDefaultInitialPermissions(String roleName, String entityType) {
        switch (roleName) {
            case "Admin":
                return entityType.equals("workspace") ? EnumSet.allOf(WorkSpacePermission.class) : EnumSet.allOf(ProjectPermission.class);
            case "Editor":
                return entityType.equals("workspace") ? DEFAULT_EDITOR_ROLE_PERMISSION : DEFAULT_PROJECT_EDITOR_PERMISSIONS;
            case "Guest":
                return entityType.equals("workspace") ? DEFAULT_GUEST_ROLE_PERMISSION : DEFAULT_PROJECT_GUEST_PERMISSIONS;
            default:
                return null;
        }
    }

    // Hàm phụ trợ để lấy vị trí mặc định của vai trò
    private Long getDefaultInitialPosition(String roleName) {
        switch (roleName) {
            case "Admin":
                return 1L;
            case "Editor":
                return 2L;
            case "Guest":
                return 3L;
            default:
                return 0L;
        }
    }

    private Member checkManageRolePermission(Long userId, EntityBelongsTo roleFor, MemberRole currentMemberRole) {
        if (roleFor.equals(EntityBelongsTo.PROJECT)) {
            return memberService.checkProjectMember(
                    userId,
                    currentMemberRole.getProject().getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(ProjectPermission.MANAGE_ROLE),
                    true
            );
        } else if (roleFor.equals(EntityBelongsTo.WORK_SPACE)) {
            return memberService.checkWorkSpaceMember(
                    userId,
                    currentMemberRole.getWorkSpace().getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(WorkSpacePermission.MANAGE_ROLE),
                    true
            );
        }
        return null;
    }

}
