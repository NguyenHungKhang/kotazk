package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.RePositionRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.tasktype.TaskTypeRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.common.RePositionResponseDto;
import com.taskmanagement.kotazk.payload.response.priority.PriorityResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusResponseDto;
import com.taskmanagement.kotazk.payload.response.tasktype.TaskTypeResponseDto;
import com.taskmanagement.kotazk.repository.IFilterSettingRepository;
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
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static com.taskmanagement.kotazk.config.ConstantConfig.DEFAULT_POSITION_STEP;

@Service
@Transactional
public class TaskTypeService implements ITaskTypeService {
    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private ITaskTypeRepository taskTypeRepository;
    @Autowired
    private IFilterSettingRepository filterSettingRepository;
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
        Customization taskCustomization = new Customization();
        taskCustomization.setIcon("IconAssembly");
        taskCustomization.setBackgroundColor("#0d9af2");

        Customization subtaskCustomization = new Customization();
        subtaskCustomization.setIcon("IconSubtask");
        subtaskCustomization.setBackgroundColor("#8a3df5");

        Customization milestoneCustomization = new Customization();
        milestoneCustomization.setIcon("IconAssemblyFilled");
        milestoneCustomization.setBackgroundColor("#47ebcd");
        return List.of(
                createDefaultInitialTaskType("Task", "", DEFAULT_POSITION_STEP, taskCustomization),
                createDefaultInitialTaskType("Subtask", "", 3L * DEFAULT_POSITION_STEP, subtaskCustomization),
                createDefaultInitialTaskType("Milestone", "", 2L * DEFAULT_POSITION_STEP, milestoneCustomization)
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
                .project(project)
                .name(taskTypeRequestDto.getName())
                .description(taskTypeRequestDto.getDescription())
                .customization(customization)
                .position(position)
                .systemInitial(false)
                .systemRequired(false)
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

        Optional.ofNullable(taskTypeRequestDto.getCustomization()).ifPresent(statusCustomization -> {
            Customization customization = Optional.ofNullable(currentTaskType.getCustomization())
                    .orElseGet(() -> {
                        Customization newCustomization = new Customization();
                        currentTaskType.setCustomization(newCustomization);
                        return newCustomization;
                    });

            Optional.ofNullable(statusCustomization.getBackgroundColor())
                    .ifPresent(customization::setBackgroundColor);
            Optional.ofNullable(statusCustomization.getIcon())
                    .ifPresent(customization::setIcon);
        });

        Optional.ofNullable(taskTypeRequestDto.getName()).ifPresent(currentTaskType::setName);
        Optional.ofNullable(taskTypeRequestDto.getDescription()).ifPresent(currentTaskType::setDescription);
        Optional.ofNullable(taskTypeRequestDto.getRePositionReq())
                .ifPresent(rePositionReq -> {
                    Long newPosition = calculateNewPositionForTaskType(rePositionReq, project, currentTaskType);
                    currentTaskType.setPosition(newPosition);
                });


        TaskType savedTaskType = taskTypeRepository.save(currentTaskType);

        return ModelMapperUtil.mapOne(savedTaskType, TaskTypeResponseDto.class);
    }

    @Override
    public List<TaskTypeResponseDto> saveList(List<TaskTypeRequestDto> taskTypeRequestDtos, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Project project = projectRepository.findById(projectId)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        WorkSpace workSpace = project.getWorkSpace();

        Member currentMember = null;
        if (!isAdmin)
            checkManageTaskTypePermission(currentUser.getId(), project.getId(), workSpace.getId());

        AtomicInteger positionIndex = new AtomicInteger();
        Set<Long> incomingTaskTypeIds = new HashSet<>();

        List<TaskType> taskTypes = taskTypeRequestDtos.stream()
                .map(t -> {
                    TaskType taskType = new TaskType();
                    Optional.ofNullable(t.getId()).ifPresent(id -> {
                        taskType.setId(id);
                        incomingTaskTypeIds.add(id);
                    });
                    if(!(t.getId() == null)) {
                        TaskType existTaskType = taskTypeRepository.findById(t.getId())
                                .orElseThrow(() -> new CustomException("Invalid input"));
                        taskType.setSystemRequired(existTaskType.getSystemRequired());
                        taskType.setSystemInitial(existTaskType.getSystemInitial());
                    }
                    if (t.getProjectId() != projectId)
                        throw new CustomException("Invalid input!");
                    taskType.setProject(project);
                    taskType.setName(t.getName());
                    taskType.setDescription(t.getDescription());
                    taskType.setPosition(RepositionUtil.calculateNewLastPosition(positionIndex.getAndIncrement()));

                    Customization customization = new Customization();
                    customization.setBackgroundColor(t.getCustomization().getBackgroundColor());
                    customization.setIcon(t.getCustomization().getIcon());
                    taskType.setCustomization(customization);


                    return taskType;
                }).toList();

        List<TaskType> deletedTaskTypes = project.getTaskTypes().stream()
                .filter(tt -> {
                    if (!incomingTaskTypeIds.contains(tt.getId()) && tt.getSystemRequired()) {
                        throw new CustomException("Cannot delete system task type");
                    }
                    return !incomingTaskTypeIds.contains(tt.getId());
                })
                .toList();


        List<Task> tasksToDelete = deletedTaskTypes.stream()
                .flatMap(tt -> tt.getTasks().stream())
                .toList();

        List<String> idTaskTypesToDelete = deletedTaskTypes.stream().map(t -> t.getId().toString()).toList();

        taskTypes.stream()
                .filter(taskType -> Objects.equals(taskType.getName(), "Task"))
                .findFirst()
                .ifPresent(taskType -> {
                    deletedTaskTypes.forEach(deletedTaskType -> deletedTaskType.setTasks(new ArrayList<>()));
                    tasksToDelete.forEach(task -> task.setTaskType(taskType));
                    taskType.setTasks(tasksToDelete);
                });

        project.getSections().forEach(section -> {
            section.getFilterSettings().forEach(filter -> {
                if (filter.getField().equals(FilterField.TASK_TYPE)) {
                    List<String> updatedValues = filter.getValues().stream()
                            .filter(value -> !idTaskTypesToDelete.contains(value))
                            .collect(Collectors.toList());
                    FilterSetting updatedFilter = FilterSetting.builder()
                            .section(section)
                            .field(filter.getField())
                            .values(updatedValues)
                            .operator(filter.getOperator())
                            .build();

                    section.getFilterSettings().remove(filter);
                    section.getFilterSettings().add(updatedFilter);
                }
            });
        });

        project.getTaskTypes().clear();
        project.getTaskTypes().addAll(taskTypes);
        List<TaskType> savedTaskTypes = projectRepository.save(project).getTaskTypes();
//        filterSettingRepository.saveAll(filterSettings);
        return ModelMapperUtil.mapList(savedTaskTypes, TaskTypeResponseDto.class);
    }

    @Override
    public List<Map<String, Object>> delete(Long id) {
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

        if (!isAdmin)
            checkManageTaskTypePermission(currentUser.getId(), project.getId(), workSpace.getId());

        if (currentTaskType.getSystemRequired()) throw new CustomException("Cannot delete this task type");

        TaskType transferTaskType = project.getTaskTypes().stream()
                .filter(tt -> tt.getName().equals("Task"))
                .findFirst()
                .orElseThrow(() -> new CustomException("Something wrong"));

        List<Task> transferTasks = currentTaskType.getTasks();

        // Unset the current task type before deletion
        transferTasks.forEach(task -> task.setTaskType(null));

        taskTypeRepository.delete(currentTaskType);
        taskTypeRepository.flush();

        // Reassign the tasks to the new task type
        transferTasks.forEach(task -> task.setTaskType(transferTaskType));
        taskRepository.saveAll(transferTasks);

        // Create a list of maps containing task ids and their new taskTypeId
        List<Map<String, Object>> taskInfoList = transferTasks.stream()
                .map(task -> {
                    Map<String, Object> taskInfo = new HashMap<>();
                    taskInfo.put("id", task.getId());
                    taskInfo.put("taskTypeId", transferTaskType.getId());
                    return taskInfo;
                })
                .collect(Collectors.toList());

        return taskInfoList;
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
    public PageResponse<TaskTypeResponseDto> getPageByProject(SearchParamRequestDto searchParam, Long projectId) {
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
            Long position,
            Customization customization
    ) {
        return TaskType.builder()
                .name(name)
                .description(description)
                .position(position)
                .systemInitial(true)
                .systemRequired(true)
                .customization(customization)
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

    public Long calculateNewPositionForTaskType(RePositionRequestDto rePositionReq, Project project, TaskType currentTaskType) {
        if (rePositionReq.getPreviousItemId() != null) {
            Long newPositionBaseOnPrevious = handlePreviousTaskTypePosition(rePositionReq.getPreviousItemId(), currentTaskType, project);
            if (newPositionBaseOnPrevious != null)
                return newPositionBaseOnPrevious;
        } else if (rePositionReq.getNextItemId() != null) {
            Long newPositionBaseOnNext = handleNextTaskTypePosition(rePositionReq.getNextItemId(), currentTaskType, project);
            if (newPositionBaseOnNext != null)
                return newPositionBaseOnNext;
        }

        throw new CustomException("Both previous and next positions cannot be null.");
    }

    private Long handlePreviousTaskTypePosition(Long previousTaskTypeId, TaskType currentTaskType, Project project) {
        Optional<TaskType> previousTaskTypeOpt = project.getTaskTypes().stream()
                .filter(taskType -> taskType.getId().equals(previousTaskTypeId))
                .findFirst();

        if (previousTaskTypeOpt.isEmpty()) {
            return null;
        }

        long previousTaskTypePosition = previousTaskTypeOpt.get().getPosition();

        Long nextTaskTypePosition = project.getTaskTypes().stream()
                .map(TaskType::getPosition)
                .filter(position -> position > previousTaskTypePosition)
                .min(Long::compare)
                .orElse(roundDownToSignificant(previousTaskTypePosition + DEFAULT_POSITION_STEP));

        if (nextTaskTypePosition - previousTaskTypePosition <= 1) {
            repositionAllTaskTypes(project); // This will reorder task types

            long updatedPreviousTaskTypePosition = project.getTaskTypes().stream()
                    .filter(taskType -> taskType.getId().equals(previousTaskTypeId))
                    .map(TaskType::getPosition)
                    .findFirst()
                    .orElse(0L);

            nextTaskTypePosition = project.getTaskTypes().stream()
                    .map(TaskType::getPosition)
                    .filter(position -> position > updatedPreviousTaskTypePosition)
                    .min(Long::compare)
                    .orElse(roundDownToSignificant(updatedPreviousTaskTypePosition + DEFAULT_POSITION_STEP));

            return (updatedPreviousTaskTypePosition + nextTaskTypePosition) / 2;
        }

        return (previousTaskTypePosition + nextTaskTypePosition) / 2;
    }

    // Function to round down to the nearest "significant" value, like 1,000,000 or 10,000
    private long roundDownToSignificant(long value) {
        if (value <= 0) return 0;
        int magnitude = (int) Math.log10(value);  // Get the number of digits - 1
        long factor = (long) Math.pow(10, magnitude); // Calculate the power of 10 based on magnitude
        return (value / factor) * factor; // Round down by removing less significant digits
    }

    private Long handleNextTaskTypePosition(Long nextTaskTypeId, TaskType currentTaskType, Project project) {
        Optional<TaskType> nextTaskTypeOpt = project.getTaskTypes().stream()
                .filter(taskType -> taskType.getId().equals(nextTaskTypeId))
                .findFirst();

        if (nextTaskTypeOpt.isEmpty()) {
            return null;
        }

        final Long nextTaskTypePosition = nextTaskTypeOpt.get().getPosition();

        long previousTaskTypePosition = project.getTaskTypes().stream()
                .map(TaskType::getPosition)
                .filter(position -> position < nextTaskTypePosition)
                .max(Long::compare)
                .orElse(0L);

        if (nextTaskTypePosition - previousTaskTypePosition <= 1) {
            repositionAllTaskTypes(project); // This will reorder task types

            // After repositioning, refetch the previous and next task type positions
            final Long updatedNextTaskTypePosition = project.getTaskTypes().stream()
                    .filter(taskType -> taskType.getId().equals(nextTaskTypeId)) // Fetch the new position of the previous task type by ID
                    .map(TaskType::getPosition)
                    .findFirst()
                    .orElse(0L); // Default to 0 if no previous task type found

            previousTaskTypePosition = project.getTaskTypes().stream()
                    .map(TaskType::getPosition)
                    .filter(position -> position < updatedNextTaskTypePosition)
                    .max(Long::compare)
                    .orElse(roundDownToSignificant(updatedNextTaskTypePosition + DEFAULT_POSITION_STEP));

            return (updatedNextTaskTypePosition + previousTaskTypePosition) / 2;
        }

        return (previousTaskTypePosition + nextTaskTypePosition) / 2;
    }

    private void repositionAllTaskTypes(Project project) {
        List<TaskType> orderedTaskTypes = project.getTaskTypes().stream()
                .sorted(Comparator.comparing(TaskType::getPosition))
                .collect(Collectors.toList());

        for (int i = 0; i < orderedTaskTypes.size(); i++) {
            TaskType taskTypeToReposition = orderedTaskTypes.get(i);
            taskTypeToReposition.setPosition(RepositionUtil.calculateNewLastPosition(i));
        }

        taskTypeRepository.saveAll(orderedTaskTypes);
    }

}
