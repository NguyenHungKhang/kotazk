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
import com.taskmanagement.kotazk.repository.ICustomizationRepository;
import com.taskmanagement.kotazk.repository.IProjectRepository;
import com.taskmanagement.kotazk.repository.IWorkSpaceRepository;
import com.taskmanagement.kotazk.service.IMemberRoleService;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.IProjectService;
import com.taskmanagement.kotazk.service.IStatusService;
import com.taskmanagement.kotazk.util.*;
import jakarta.persistence.criteria.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.*;

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
    private IStatusService statusService = new StatusService();
    @Autowired
    private ICustomizationRepository customizationRepository;
    @Autowired
    private TimeUtil timeUtil;
    @Autowired
    private final BasicSpecificationUtil<Project> specificationUtil = new BasicSpecificationUtil<>();

    @Override
    public ProjectResponseDto initialProject(ProjectRequestDto project) {
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = workSpaceRepository.findById(project.getWorkSpaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", project.getWorkSpaceId()));

        Member currentMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.CREATE_PROJECT),
                true
        );


        Project newProject = ModelMapperUtil.mapOne(project, Project.class);

        if (workSpace.getCustomization() != null) {
            Customization customization = Customization.builder()
                    .avatar(workSpace.getCustomization().getAvatar())
                    .backgroundColor(workSpace.getCustomization().getBackgroundColor())
                    .fontColor(workSpace.getCustomization().getFontColor())
                    .icon(workSpace.getCustomization().getIcon())
                    .build();

            Customization savedCustomization = customizationRepository.save(customization);
            newProject.setCustomization(savedCustomization);
        } else newProject.setCustomization(null);

        String key = null;
        do {
            key = RandomStringGeneratorUtil.generateKey();
        } while (projectRepository.findByKey(key).isPresent());
        newProject.setKey(key);
        newProject.setPosition((long) workSpace.getProjects().size());
        newProject.setId(null);
        newProject.setMember(currentMember);
        newProject.setWorkSpace(workSpace);

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
        statusService.initialStatus(savedProject.getId());
        return ModelMapperUtil.mapOne(savedProject, ProjectResponseDto.class);
    }

    @Override
    public ProjectResponseDto create(ProjectRequestDto project) {
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = workSpaceRepository.findById(project.getWorkSpaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", project.getWorkSpaceId()));
        Member currentMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.CREATE_PROJECT),
                true
        );

        Project newProject = ModelMapperUtil.mapOne(project, Project.class);
        newProject.setId(null);
        newProject.setMember(currentMember);
        newProject.setWorkSpace(workSpace);

        Project savedProject = projectRepository.save(newProject);
        return ModelMapperUtil.mapOne(savedProject, ProjectResponseDto.class);
    }

    @Override
    public ProjectResponseDto update(Long id, ProjectRequestDto project) {
        Project currentProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("project", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace =currentProject.getWorkSpace();

        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                currentProject.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.MODIFY_PROJECT),
                false
        );

        Member currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.MODIFY_ALL_PROJECT),
                false
        );

        if (currentProjectMember == null && currentWorkSpaceMember == null)
            throw new CustomException("This member's role is not permission with this action!");

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

        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                currentProject.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.DELETE_PROJECT),
                false
        );

        Member currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.DELETE_ALL_PROJECT),
                false
        );

        if (currentProjectMember == null && currentWorkSpaceMember == null)
            throw new CustomException("This member's role is not permission with this action!");

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

        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                currentProject.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.DELETE_PROJECT),
                false
        );

        Member currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.DELETE_ALL_PROJECT),
                false
        );

        if (currentProjectMember == null && currentWorkSpaceMember == null)
            throw new CustomException("This member's role is not permission with this action!");


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

        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                currentProject.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.MODIFY_PROJECT),
                false
        );

        Member currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.MODIFY_ALL_PROJECT),
                false
        );

        if (currentProjectMember == null && currentWorkSpaceMember == null)
            throw new CustomException("This member's role is not permission with this action!");

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

        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                currentProject.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.MODIFY_PROJECT),
                false
        );

        Member currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.MODIFY_ALL_PROJECT),
                false
        );

        if (currentProjectMember == null && currentWorkSpaceMember == null)
            throw new CustomException("This member's role is not permission with this action!");

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


        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                currentProject.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.BROWSE_PROJECT),
                false
        );

        Member currentWorkSpaceMember = null;

        if (currentProject.getVisibility().equals(Visibility.PRIVATE))
            currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                    currentUser.getId(),
                    workSpace.getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(WorkSpacePermission.BROWSE_PUBLIC_PROJECT),
                    false
            );
        else if (currentProject.getVisibility().equals(Visibility.PUBLIC))
            currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                    currentUser.getId(),
                    workSpace.getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(WorkSpacePermission.BROWSE_PRIVATE_PROJECT),
                    false
            );

        if (currentProjectMember == null && currentWorkSpaceMember == null)
            throw new CustomException("This member's role is not permission with this action!");


        return ModelMapperUtil.mapOne(currentProject, ProjectResponseDto.class);
    }

    @Override
    public PageResponse<ProjectResponseDto> getPageByWorkSpace(SearchParamRequestDto searchParam, Long workSpaceId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Long userId = currentUser.getId();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        WorkSpace workSpace = workSpaceRepository.findById(workSpaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", workSpaceId));

        Member currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.VIEW_PRIVATE_PROJECT_LIST),
                false
        );

        Specification<Project> permissionSpecification = (Root<Project> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Predicate publicProjectsPredicate = criteriaBuilder.equal(root.get("visibility"), Visibility.PUBLIC);
            Predicate privateProjectsPredicate = criteriaBuilder.disjunction();

            if (currentWorkSpaceMember != null &&
                    currentWorkSpaceMember.getRole().getWorkSpacePermissions().contains(WorkSpacePermission.VIEW_PRIVATE_PROJECT_LIST)) {
                privateProjectsPredicate = criteriaBuilder.equal(root.get("visibility"), Visibility.PRIVATE);
            } else {
                Join<Project, Member> projectMemberJoin = root.join("members", JoinType.LEFT);
                Predicate privateMemberPredicate = criteriaBuilder.equal(root.get("visibility"), Visibility.PRIVATE);
                Predicate userMemberPredicate = criteriaBuilder.equal(projectMemberJoin.get("user").get("id"), userId);
                Predicate statusPredicate = criteriaBuilder.equal(projectMemberJoin.get("status"), MemberStatus.ACTIVE);
                privateProjectsPredicate = criteriaBuilder.and(privateMemberPredicate, userMemberPredicate, statusPredicate);
            }

            return criteriaBuilder.or(publicProjectsPredicate, privateProjectsPredicate);
        };

        Specification<Project> workSpaceSpecification = (Root<Project> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<Project, WorkSpace> workSpaceJoin = root.join("workSpace");
            return criteriaBuilder.equal(workSpaceJoin.get("id"), workSpace.getId());
        };

        Specification<Project> filterSpecification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "createdAt"));

        Specification<Project> specification = Specification.where(workSpaceSpecification)
                .and(permissionSpecification)
                .and(filterSpecification);

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
}
