package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.MemberStatus;
import com.taskmanagement.kotazk.entity.enums.ProjectPermission;
import com.taskmanagement.kotazk.entity.enums.Role;
import com.taskmanagement.kotazk.entity.enums.WorkSpacePermission;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.RePositionRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.tasktype.TaskTypeRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.common.RePositionResponseDto;
import com.taskmanagement.kotazk.payload.response.priority.PriorityResponseDto;
import com.taskmanagement.kotazk.payload.response.tasktype.TaskTypeResponseDto;
import com.taskmanagement.kotazk.repository.IProjectRepository;
import com.taskmanagement.kotazk.repository.ITaskRepository;
import com.taskmanagement.kotazk.repository.ITaskTypeRepository;
import com.taskmanagement.kotazk.service.ICustomizationService;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.ITaskTypeService;
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
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TaskTypeService implements ITaskTypeService {
    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private ITaskTypeRepository taskTypeRepository;
    @Autowired
    private ITaskRepository taskRepository;
    @Autowired
    private ICustomizationService customizationService = new CustomizationService();
    @Autowired
    private IMemberService memberService = new MemberService();
    @Autowired
    private final BasicSpecificationUtil<TaskType> specificationUtil = new BasicSpecificationUtil<>();
    @Autowired
    private TimeUtil timeUtil;

    @Override
    public List<TaskType> initialTaskType() {
        return List.of(
                createDefaultInitialTaskType("Task", "", RepositionUtil.calculateNewLastPosition(0)),
                createDefaultInitialTaskType("Subtask", "", RepositionUtil.calculateNewLastPosition(1)),
                createDefaultInitialTaskType("Milestone", "", RepositionUtil.calculateNewLastPosition(2))
        );
    }

    @Override
    public TaskTypeResponseDto create(TaskTypeRequestDto taskTypeRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Project project = projectRepository.findById(taskTypeRequestDto.getProjectId())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", taskTypeRequestDto.getProjectId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin)
            checkManageTaskTypePermission(currentUser.getId(), project.getId(), workSpace.getId());

        Customization customization = Optional.ofNullable(taskTypeRequestDto.getCustomization())
                .map(customizationService::createBuilder)
                .orElse(null);

        Long position = RepositionUtil.calculateNewLastPosition(project.getTaskTypes().size());

        TaskType newTaskType = TaskType.builder()
                .name(taskTypeRequestDto.getName())
                .description(taskTypeRequestDto.getDescription())
                .customization(customization)
                .position(position)
                .build();

        TaskType savedTaskType = taskTypeRepository.save(newTaskType);

        return ModelMapperUtil.mapOne(savedTaskType, TaskTypeResponseDto.class);
    }

    @Override
    public TaskTypeResponseDto update(Long id, TaskTypeRequestDto taskTypeRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        TaskType currentTaskType = taskTypeRepository.findById(id)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Task type", "id", id));
        Project project = Optional.of(currentTaskType.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", taskTypeRequestDto.getProjectId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin)
            checkManageTaskTypePermission(currentUser.getId(), project.getId(), workSpace.getId());

        Optional.ofNullable(taskTypeRequestDto.getName()).ifPresent(currentTaskType::setName);
        Optional.ofNullable(taskTypeRequestDto.getDescription()).ifPresent(currentTaskType::setDescription);
        Optional.ofNullable(taskTypeRequestDto.getCustomization()).ifPresent(customization -> {
            Optional.ofNullable(customization.getAvatar()).ifPresent(currentTaskType.getCustomization()::setAvatar);
            Optional.ofNullable(customization.getBackgroundColor()).ifPresent(currentTaskType.getCustomization()::setBackgroundColor);
            Optional.ofNullable(customization.getFontColor()).ifPresent(currentTaskType.getCustomization()::setFontColor);
            Optional.ofNullable(customization.getIcon()).ifPresent(currentTaskType.getCustomization()::setIcon);
        });

        TaskType savedTaskType = taskTypeRepository.save(currentTaskType);

        return ModelMapperUtil.mapOne(savedTaskType, TaskTypeResponseDto.class);
    }

    @Override
    public Boolean delete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        TaskType currentTaskType = taskTypeRepository.findById(id)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Task type", "id", id));
        Project project = Optional.of(currentTaskType.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", currentTaskType.getProject().getId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin)
            checkManageTaskTypePermission(currentUser.getId(), project.getId(), workSpace.getId());

        if (currentTaskType.getSystemRequired()) throw new CustomException("Can not delete this task type");

        TaskType transferTaskType = project.getTaskTypes().stream()
                .filter(tt -> tt.getName().equals("Task"))
                .findFirst()
                .orElseThrow(() -> new CustomException("Something wrong"));

        List<Task> transferTasks = currentTaskType.getTasks();
        transferTasks.forEach(task -> task.setTaskType(null));

        taskTypeRepository.delete(currentTaskType);
        taskTypeRepository.flush();

        transferTasks.forEach(task -> task.setTaskType(transferTaskType));
        taskRepository.saveAll(transferTasks);
        return true;
    }

    @Override
    public Boolean softDelete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        TaskType currentTaskType = taskTypeRepository.findById(id)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Task type", "id", id));
        Project project = Optional.of(currentTaskType.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", currentTaskType.getProject().getId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        Member currentMember = null;
        if (!isAdmin)
            checkManageTaskTypePermission(currentUser.getId(), project.getId(), workSpace.getId());

        if (currentTaskType.getSystemRequired())
            throw new CustomException("Can not delete this task type");

        TaskType transferTaskType = project.getTaskTypes().stream()
                .filter(tt -> tt.getName().equals("Task"))
                .findFirst()
                .orElseThrow(() -> new CustomException("Something wrong"));

        List<Task> transferTasks = currentTaskType.getTasks();
        transferTasks.forEach(task -> task.setTaskType(null));
        currentTaskType.setDeletedAt(currentTime);

        taskTypeRepository.save(currentTaskType);
        taskTypeRepository.flush();

        transferTasks.forEach(task -> task.setTaskType(transferTaskType));
        taskRepository.saveAll(transferTasks);
        return true;
    }

    @Override
    public RePositionResponseDto rePosition(RePositionRequestDto rePositionRequestDto, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Project project = projectRepository.findById(projectId)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin)
            checkManageTaskTypePermission(currentUser.getId(), project.getId(), workSpace.getId());


        Long nextTaskTypePosition = project.getTaskTypes().stream()
                .filter(t -> t.getId().equals(rePositionRequestDto.getNextItemId()))
                .findFirst()
                .map(TaskType::getPosition)
                .orElse(null);

        Long previousTaskTypePosition = project.getTaskTypes().stream()
                .filter(t -> t.getId().equals(rePositionRequestDto.getPreviousItemId()))
                .findFirst()
                .map(TaskType::getPosition)
                .orElse(null);

        TaskType currentTaskType = project.getTaskTypes().stream()
                .filter(t -> t.getId().equals(rePositionRequestDto.getCurrentItemId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", rePositionRequestDto.getCurrentItemId()));

        currentTaskType.setPosition(RepositionUtil.calculateNewPosition(previousTaskTypePosition, nextTaskTypePosition));

        TaskType savedTaskType = taskTypeRepository.save(currentTaskType);

        return RePositionResponseDto.builder()
                .id(savedTaskType.getId())
                .newPosition(savedTaskType.getPosition())
                .build();
    }

    @Override
    public TaskTypeResponseDto getOne(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        TaskType currentTaskType = taskTypeRepository.findById(id)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Task type", "id", id));
        Project project = Optional.of(currentTaskType.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", currentTaskType.getProject().getId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin) memberService.checkProjectAndWorkspaceBrowserPermission(currentUser, project, null);

        return ModelMapperUtil.mapOne(currentTaskType, TaskTypeResponseDto.class);
    }

    @Override
    public PageResponse<TaskTypeResponseDto> getPageByWorkSpace(SearchParamRequestDto searchParam, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Project project = projectRepository.findById(projectId)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin)
            currentMember = memberService.checkProjectAndWorkspaceBrowserPermission(currentUser, project, null);


        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "createdAt"));

        Specification<TaskType> projectSpecification = (Root<TaskType> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<TaskType, Project> projectJoin = root.join("project");
            return criteriaBuilder.equal(projectJoin.get("id"), project.getId());
        };

        Specification<TaskType> filterSpecification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Specification<TaskType> specification = Specification.where(projectSpecification)
                .and(filterSpecification);

        Page<TaskType> page = taskTypeRepository.findAll(specification, pageable);
        List<TaskTypeResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), TaskTypeResponseDto.class);
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

    // Utility Functions

    private TaskType createDefaultInitialTaskType(
            String name,
            String description,
            Long position
    ) {
        return TaskType.builder()
                .name(name)
                .description(description)
                .position(position)
                .systemInitial(true)
                .systemRequired(true)
                .build();
    }


    private Member checkManageTaskTypePermission(Long userId, Long projectId, Long workspaceId) {

        Member currentProjectMember = memberService.checkProjectMember(
                userId,
                projectId,
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.MANAGE_TASK_TYPE),
                false
        );

        Member currentWorkspaceMember = memberService.checkWorkSpaceMember(
                userId,
                workspaceId,
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.MODIFY_ALL_PROJECT),
                false
        );

        return Optional.ofNullable(currentProjectMember)
                .orElse(Optional.ofNullable(currentWorkspaceMember)
                        .orElseThrow(() -> new CustomException("Invalid input!")));

    }

}
