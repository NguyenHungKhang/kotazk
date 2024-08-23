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
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.IStatusService;
import com.taskmanagement.kotazk.util.BasicSpecificationUtil;
import com.taskmanagement.kotazk.util.ModelMapperUtil;
import com.taskmanagement.kotazk.util.SecurityUtil;
import com.taskmanagement.kotazk.util.TimeUtil;
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
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
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
    public StatusResponseDto create(StatusRequestDto status) {
        User currentUser = SecurityUtil.getCurrentUser();
        Project currentProject = projectRepository.findById(status.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", status.getProjectId()));

        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                currentProject.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.MANAGE_WORKFLOW),
                true
        );

        Status newStatus = ModelMapperUtil.mapOne(status, Status.class);
        newStatus.setId(null);
        if (status.getPosition() == null) status.setPosition((long) currentProject.getStatuses().size());
        newStatus.setProject(currentProject);

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

        statusRepository.deleteById(currentStatus.getId());
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
