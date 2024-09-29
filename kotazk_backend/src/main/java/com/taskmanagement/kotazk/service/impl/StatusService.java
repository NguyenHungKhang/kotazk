package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.CustomException;
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
import com.taskmanagement.kotazk.repository.ITaskRepository;
import com.taskmanagement.kotazk.service.ICustomizationService;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.IStatusService;
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

import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class StatusService implements IStatusService {

    @Autowired
    private IStatusRepository statusRepository;
    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private ITaskRepository taskRepository;
    @Autowired
    private IMemberService memberService = new MemberService();
    @Autowired
    private ICustomizationService customizationService = new CustomizationService();
    @Autowired
    private ICustomizationRepository customizationRepository;
    @Autowired
    private TimeUtil timeUtil;
    @Autowired
    private final BasicSpecificationUtil<Status> specificationUtil = new BasicSpecificationUtil<>();

    @Override
    public List<Status> initialStatus() {
        return List.of(
                createDefaultInitialStatus("To do", 0L, false, true, true),
                createDefaultInitialStatus("In process", 1L, false, false, true),
                createDefaultInitialStatus("Done", 2L, true, false, true)
        );
    }

    @Override
    public StatusResponseDto create(StatusRequestDto statusRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        Project project = projectRepository.findById(statusRequestDto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", statusRequestDto.getProjectId()));

        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.MANAGE_WORKFLOW),
                true
        );

        Customization customization = Optional.ofNullable(statusRequestDto.getCustomization())
                .map(customizationService::createBuilder)
                .orElse(null);

        project.getStatuses().stream()
                .filter(s -> s.getName().equals(statusRequestDto.getName()))
                .findFirst()
                .ifPresent(s -> {
                    throw new CustomException("This status name already exists!");
                });

        Status newStatus = Status.builder()
                .project(project)
                .customization(customization)
                .isFromAny(statusRequestDto.getIsFromAny())
                .isFromStart(statusRequestDto.getIsFromStart())
                .isCompletedStatus(statusRequestDto.getIsCompletedStatus())
                .name(statusRequestDto.getName())
                .description(statusRequestDto.getDescription())
                .position(RepositionUtil.calculateNewLastPosition(project.getStatuses().size()))
                .systemRequired(false)
                .systemInitial(false)
                .build();

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

        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                currentProject.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.MANAGE_WORKFLOW),
                true
        );

        Optional.ofNullable(status.getCustomization()).ifPresent(statusCustomization -> {
            Customization customization = Optional.ofNullable(currentStatus.getCustomization())
                    .orElseGet(() -> {
                        Customization newCustomization = new Customization();
                        currentStatus.setCustomization(newCustomization);
                        return newCustomization;
                    });

            Optional.ofNullable(statusCustomization.getBackgroundColor())
                    .ifPresent(customization::setBackgroundColor);
            Optional.ofNullable(statusCustomization.getIcon())
                    .ifPresent(customization::setIcon);
        });

        Optional.ofNullable(status.getName()).ifPresent(currentStatus::setName);
        Optional.ofNullable(status.getDescription()).ifPresent(currentStatus::setDescription);
        Optional.ofNullable(status.getIsFromAny()).ifPresent(currentStatus::setIsFromAny);
        Optional.ofNullable(status.getIsFromStart()).ifPresent(currentStatus::setIsFromStart);
        Optional.ofNullable(status.getIsCompletedStatus()).ifPresent(currentStatus::setIsCompletedStatus);

        Status savedStatus = statusRepository.save(currentStatus);
        return ModelMapperUtil.mapOne(savedStatus, StatusResponseDto.class);
    }

    @Override
    public Boolean delete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        Status currentStatus = statusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Status", "id", id));
        Project currentProject = currentStatus.getProject();

        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                currentProject.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.MANAGE_WORKFLOW),
                true
        );

        Status tranferStatus = currentProject.getStatuses().stream()
                .filter(status -> (currentStatus.getIsCompletedStatus() && status.getIsCompletedStatus())
                        || (!currentStatus.getIsCompletedStatus() && status.getIsFromStart()))
                .filter(status -> !status.equals(currentStatus))
                .min(Comparator.comparingLong(Status::getPosition))
                .orElseThrow(() -> new CustomException("Cannot delete this status"));

        List<Task> tasksToTransfer = currentStatus.getTasks();

        if(tasksToTransfer != null && !tasksToTransfer.isEmpty() ) {
            tasksToTransfer.forEach(task -> task.setStatus(tranferStatus));
            taskRepository.saveAllAndFlush(tasksToTransfer);
        }

        statusRepository.deleteAllInBatch(Collections.singleton(currentStatus));
        return true;
    }

    @Override
    public Boolean softDelete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        Status currentStatus = statusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Status", "id", id));
        Project currentProject = currentStatus.getProject();
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();
        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                currentProject.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.MANAGE_WORKFLOW),
                true
        );

        Status tranferStatus = null;

        if (currentStatus.getIsCompletedStatus())
            tranferStatus = currentProject.getStatuses().stream()
                    .filter(status -> status.getIsCompletedStatus() && !status.equals(currentStatus))
                    .min(Comparator.comparingLong(Status::getPosition))
                    .orElse(null);
        else
            tranferStatus = currentProject.getStatuses().stream()
                    .filter(status -> status.getIsFromStart() && !status.equals(currentStatus))
                    .min(Comparator.comparingLong(Status::getPosition))
                    .orElse(null);

        if (tranferStatus == null) throw new CustomException("Cannot delete this status");

        List<Task> tasksToTransfer = currentStatus.getTasks();
        tasksToTransfer.sort(Comparator.comparingLong(Task::getPosition));

        int position = 1;
        for (Task task : tasksToTransfer) {
            task.setStatus(tranferStatus);
            task.setPosition((long) position);
            position++;
        }
        taskRepository.saveAll(tasksToTransfer);


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
        Project currentProject = currentStatus.getProject();
        WorkSpace currentWorkSpace = currentProject.getWorkSpace();

        Member currentWorkSpaceMember = Optional.ofNullable(currentProject.getVisibility())
                .map(visibility -> {
                    WorkSpacePermission permission = visibility.equals(Visibility.PRIVATE)
                            ? WorkSpacePermission.BROWSE_PRIVATE_PROJECT
                            : WorkSpacePermission.BROWSE_PUBLIC_PROJECT;
                    return memberService.checkWorkSpaceMember(
                            currentUser.getId(),
                            currentWorkSpace.getId(),
                            Collections.singletonList(MemberStatus.ACTIVE),
                            Collections.singletonList(permission),
                            false
                    );
                })
                .orElse(null);

        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                currentProject.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.BROWSE_PROJECT),
                false
        );

        if (currentProjectMember == null && currentWorkSpaceMember == null)
            throw new CustomException("This member's role is not permission with this action!");

        return ModelMapperUtil.mapOne(currentStatus, StatusResponseDto.class);
    }

    @Override
    public StatusSummaryResponseDto getSummaryOne(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        Status currentStatus = statusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Status", "id", id));
        if (currentStatus.getDeletedAt() != null) throw new ResourceNotFoundException("Status", "id", id);
        Project currentProject = currentStatus.getProject();
        WorkSpace currentWorkSpace = currentProject.getWorkSpace();


        Member currentWorkSpaceMember = Optional.ofNullable(currentProject.getVisibility())
                .map(visibility -> {
                    WorkSpacePermission permission = visibility.equals(Visibility.PRIVATE)
                            ? WorkSpacePermission.BROWSE_PRIVATE_PROJECT
                            : WorkSpacePermission.BROWSE_PUBLIC_PROJECT;
                    return memberService.checkWorkSpaceMember(
                            currentUser.getId(),
                            currentWorkSpace.getId(),
                            Collections.singletonList(MemberStatus.ACTIVE),
                            Collections.singletonList(permission),
                            false
                    );
                })
                .orElse(null);


        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                currentProject.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.BROWSE_PROJECT),
                false
        );

        if (currentProjectMember == null && currentWorkSpaceMember == null)
            throw new CustomException("This member's role is not permission with this action!");

        return ModelMapperUtil.mapOne(currentStatus, StatusSummaryResponseDto.class);
    }

    @Override
    public PageResponse<StatusResponseDto> getPageByProject(SearchParamRequestDto searchParam, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Project currentProject = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        WorkSpace currentWorkSpace = currentProject.getWorkSpace();

        if (currentUser.getRole().equals(Role.USER)) {
            Member currentWorkSpaceMember = null;

            if (currentProject.getVisibility().equals(Visibility.PRIVATE))
                currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                        currentUser.getId(),
                        currentWorkSpace.getId(),
                        Collections.singletonList(MemberStatus.ACTIVE),
                        Collections.singletonList(WorkSpacePermission.BROWSE_PRIVATE_PROJECT),
                        false
                );
            else if (currentProject.getVisibility().equals(Visibility.PUBLIC))
                currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                        currentUser.getId(),
                        currentWorkSpace.getId(),
                        Collections.singletonList(MemberStatus.ACTIVE),
                        Collections.singletonList(WorkSpacePermission.BROWSE_PUBLIC_PROJECT),
                        false
                );
            Member currentProjectMember = memberService.checkProjectMember(
                    currentUser.getId(),
                    currentProject.getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(ProjectPermission.BROWSE_PROJECT),
                    false
            );
        }

        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "createdAt"));

        Specification<Status> projectSpecification = (Root<Status> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<Status, Project> projectJoin = root.join("project");
            return criteriaBuilder.equal(projectJoin.get("id"), currentProject.getId());
        };

        Specification<Status> filterSpecification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Specification<Status> specification = Specification.where(projectSpecification)
                .and(filterSpecification);

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
        Project currentProject = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        WorkSpace currentWorkSpace = currentProject.getWorkSpace();

        if (currentUser.getRole().equals(Role.USER)) {
            Member currentWorkSpaceMember = null;

            if (currentProject.getVisibility().equals(Visibility.PRIVATE))
                currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                        currentUser.getId(),
                        currentWorkSpace.getId(),
                        Collections.singletonList(MemberStatus.ACTIVE),
                        Collections.singletonList(WorkSpacePermission.BROWSE_PRIVATE_PROJECT),
                        false
                );
            else if (currentProject.getVisibility().equals(Visibility.PUBLIC))
                currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                        currentUser.getId(),
                        currentWorkSpace.getId(),
                        Collections.singletonList(MemberStatus.ACTIVE),
                        Collections.singletonList(WorkSpacePermission.BROWSE_PUBLIC_PROJECT),
                        false
                );
            Member currentProjectMember = memberService.checkProjectMember(
                    currentUser.getId(),
                    currentProject.getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(ProjectPermission.BROWSE_PROJECT),
                    false
            );
        }

        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "createdAt"));

        Specification<Status> projectSpecification = (Root<Status> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<Status, Project> projectJoin = root.join("project");
            return criteriaBuilder.equal(projectJoin.get("id"), currentProject.getId());
        };

        Specification<Status> filterSpecification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Specification<Status> specification = Specification.where(projectSpecification)
                .and(filterSpecification);

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

    // Utilities Function

    private Status createDefaultInitialStatus(String name, Long position, boolean isCompletedStatus, boolean isFromStart, boolean isFromAny) {
        return Status.builder()
                .name(name)
                .description("")
                .position(position)
                .systemInitial(true)
                .systemRequired(false)
                .isCompletedStatus(isCompletedStatus)
                .isFromStart(isFromStart)
                .isFromAny(isFromAny)
                .build();
    }
}
