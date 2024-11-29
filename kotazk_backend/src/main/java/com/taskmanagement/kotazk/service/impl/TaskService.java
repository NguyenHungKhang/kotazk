package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.FilterCriteriaRequestDto;
import com.taskmanagement.kotazk.payload.request.common.RePositionRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.task.TaskRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.common.RePositionResponseDto;
import com.taskmanagement.kotazk.payload.response.project.ProjectResponseDto;
import com.taskmanagement.kotazk.payload.response.task.TaskResponseDto;
import com.taskmanagement.kotazk.repository.*;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.ITaskService;
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
import java.util.stream.Collectors;

import static com.taskmanagement.kotazk.config.ConstantConfig.DEFAULT_POSITION_STEP;

@Service
@Transactional
public class TaskService implements ITaskService {
    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private ITaskRepository taskRepository;
    @Autowired
    private IStatusRepository statusRepository;
    @Autowired
    private IPriorityRepository priorityRepository;
    @Autowired
    private ILabelRepository labelRepository;
    @Autowired
    private IMemberRepository memberRepository;
    @Autowired
    private IActivityLogRepository activityLogRepository;
    @Autowired
    private IMemberService memberService = new MemberService();
    @Autowired
    private final BasicSpecificationUtil<Task> specificationUtil = new BasicSpecificationUtil<>();
    @Autowired
    private TimeUtil timeUtil;

    @Override
    public TaskResponseDto create(TaskRequestDto taskRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        Project project = projectRepository.findById(taskRequestDto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", taskRequestDto.getProjectId()));
        Member currentMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                new ArrayList<>(),
                true
        );

        List<ActivityLog> activityLogs = new ArrayList<>();

        if (!currentMember.getRole().getProjectPermissions().contains(ProjectPermission.CREATE_TASKS))
            throw new CustomException("This user do not have permission to create task in this project");

        WorkSpace currentWorkSpace = project.getWorkSpace();
        Member assignee = checkAssignee(currentMember, project, taskRequestDto.getAssigneeId());
        Member reporter = null;
        Set<Collectors> collaborators = new HashSet<>();
        Status status = checkStatus(project, taskRequestDto.getStatusId());
        Priority priority = checkPriority(project, taskRequestDto.getPriorityId());
        Float timeEstimate = taskRequestDto.getTimeEstimate();
        Boolean isCompleted = taskRequestDto.getIsCompleted() != null;
        Task parentTask = checkParentTask(project, taskRequestDto.getParentTaskId());

        List<Timestamp> startAndEndTime = checkStartAndEndTime(currentMember, TimeUtil.convertSpecificStringToTimestamp(taskRequestDto.getStartAt()), TimeUtil.convertSpecificStringToTimestamp(taskRequestDto.getEndAt()));
        Timestamp startAt = startAndEndTime.get(0);
        Timestamp endAt = startAndEndTime.get(1);

        TaskType taskType = checkTaskType(project, taskRequestDto.getTaskTypeId());
        Set<Label> labels = checkLabels(project, taskRequestDto.getLabelIds());

        Task newTask = Task.builder()
                .name(taskRequestDto.getName())
                .description(taskRequestDto.getDescription())
                .workSpace(currentWorkSpace)
                .project(project)
                .creator(currentMember)
                .assignee(assignee)
                .status(status)
                .priority(priority)
                .timeEstimate(timeEstimate)
                .isCompleted(isCompleted)
                .startAt(startAt)
                .endAt(endAt)
                .labels(labels)
                .taskType(taskType)
                .isCompleted(isCompleted)
                .position(RepositionUtil.calculateNewLastPosition(project.getTasks().size()))
                .parentTask(parentTask)
                .build();

        Task savedTask = taskRepository.save(newTask);

        if (parentTask != null) {
            ActivityLog parrentActivityLog = activityLogTaskTemplate(parentTask, currentUser, currentMember, String.format("add child task 7461736B%s", savedTask.getId()));
            activityLogs.add(parrentActivityLog);
        }
        ActivityLog taskActivityLog = activityLogTaskTemplate(savedTask, currentUser, currentMember, String.format("create this task"));

        activityLogs.add(taskActivityLog);
        activityLogRepository.saveAll(activityLogs);

        return ModelMapperUtil.mapOne(savedTask, TaskResponseDto.class);
    }

    @Override
    public TaskResponseDto update(Long id, TaskRequestDto taskRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Task currentTask = taskRepository.findById(id)
                .filter(task -> isAdmin || task.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        Project project = currentTask.getProject();
        WorkSpace workSpace = currentTask.getWorkSpace();
        List<ActivityLog> activityLogs = new ArrayList<>();

        Member currentMember;
        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.EDIT_TASKS),
                false
        );

        Member currentWorkspaceMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.MODIFY_ALL_PROJECT),
                false
        );

        if (currentProjectMember != null) currentMember = currentProjectMember;
        else if (currentWorkspaceMember != null) currentMember = currentWorkspaceMember;
        else {
            currentMember = null;
            throw new CustomException("This user can not do this action");
        }

        Optional.ofNullable(taskRequestDto.getName())
                .ifPresent(name -> {
                    String content = String.format("changed name from %s to %s", currentTask.getName(), name);
                    ActivityLog newActivityLog = activityLogTaskTemplate(currentTask, currentUser, currentMember, content);
                    activityLogs.add(newActivityLog);
                    currentTask.setName(name);
                });

        Optional.ofNullable(taskRequestDto.getDescription())
                .ifPresent(desc -> {
                    String content = String.format("changed description");
                    ActivityLog newActivityLog = activityLogTaskTemplate(currentTask, currentUser, currentMember, content);
                    activityLogs.add(newActivityLog);
                    currentTask.setDescription(desc);
                });

        Optional.ofNullable(taskRequestDto.getAssigneeId())
                .ifPresent(assigneeId -> {
                    Member assignee = checkAssignee(currentMember, project, assigneeId);
                    String content;
                    if (assignee == null)
                        content = String.format("removed assignee from");
                    else
                        content = String.format("assigned to %s %s", assignee.getUser().getFirstName(), assignee.getUser().getLastName());
                    ActivityLog newActivityLog = activityLogTaskTemplate(currentTask, currentUser, currentMember, content);
                    activityLogs.add(newActivityLog);
                    currentTask.setAssignee(assignee);
                });

        Optional.ofNullable(taskRequestDto.getStatusId())
                .ifPresent(statusId -> {
                    Status status = checkStatus(project, statusId);
                    String content = String.format("changed status from %s to %s", currentTask.getStatus().getName(), status.getName());
                    ActivityLog newActivityLog = activityLogTaskTemplate(currentTask, currentUser, currentMember, content);
                    activityLogs.add(newActivityLog);
                    currentTask.setStatus(status);
                });

        Optional.ofNullable(taskRequestDto.getPriorityId())
                .ifPresent(priorityId -> {
                    Priority priority = checkPriority(project, priorityId);
                    String content;
                    if (priority == null)
                        content = String.format("removed priority from this task");
                    else if (currentTask.getPriority() == null)
                        content = String.format("set priority %s", priority.getName());
                    else
                        content = String.format("changed priority from %s to %s", currentTask.getPriority().getName(), priority.getName());
                    ActivityLog newActivityLog = activityLogTaskTemplate(currentTask, currentUser, currentMember, content);
                    activityLogs.add(newActivityLog);
                    currentTask.setPriority(priority);
                });

        Optional.ofNullable(taskRequestDto.getTimeEstimate())
                .ifPresent(timeEstimate -> {
                    String content;
                    if (currentTask.getPriority() == null)
                        content = String.format("set time estimate %s", timeEstimate.toString());
                    else
                        content = String.format("changed time estimate from %s to %s", currentTask.getTimeEstimate().toString(), timeEstimate.toString());
                    ActivityLog newActivityLog = activityLogTaskTemplate(currentTask, currentUser, currentMember, content);
                    activityLogs.add(newActivityLog);
                    currentTask.setTimeEstimate(timeEstimate);
                });

        if (taskRequestDto.getIsCompleted() != null) {
            String content;
            if (currentTask.getIsCompleted() == true)
                content = String.format("set task completed");
            else
                content = String.format("set task uncompleted");
            ActivityLog newActivityLog = activityLogTaskTemplate(currentTask, currentUser, currentMember, content);
            activityLogs.add(newActivityLog);
            currentTask.setIsCompleted(taskRequestDto.getIsCompleted());
        }

        if (taskRequestDto.getStartAt() != null && taskRequestDto.getEndAt() != null) {
            List<Timestamp> startAndEndTime = checkStartAndEndTime(currentMember, TimeUtil.convertSpecificStringToTimestamp(taskRequestDto.getStartAt()), TimeUtil.convertSpecificStringToTimestamp(taskRequestDto.getEndAt()));
            currentTask.setStartAt(startAndEndTime.get(0));
            currentTask.setEndAt(startAndEndTime.get(1));
        }


        Optional.ofNullable(taskRequestDto.getTaskTypeId())
                .ifPresent(taskTypeId -> {
                    TaskType taskType = checkTaskType(project, taskTypeId);
                    String content = String.format("changed task type from %s to %s", currentTask.getTaskType().getName(), taskType.getName());
                    ActivityLog newActivityLog = activityLogTaskTemplate(currentTask, currentUser, currentMember, content);
                    activityLogs.add(newActivityLog);
                    currentTask.setTaskType(taskType);
                });

        Optional.ofNullable(taskRequestDto.getLabelIds())
                .ifPresent(labelIds -> {
                    currentTask.setLabels(checkLabels(project, labelIds));
                });

        Optional.ofNullable(taskRequestDto.getRePositionReq())
                .ifPresent(rePositionReq -> {
                    Long newPosition = calculateNewPositionForTask(rePositionReq, project, currentTask);
                    currentTask.setPosition(newPosition);
                });

        Task savedTask = taskRepository.save(currentTask);

        activityLogRepository.saveAll(activityLogs);

        return ModelMapperUtil.mapOne(savedTask, TaskResponseDto.class);
    }

    @Override
    public Boolean delete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Task currentTask = taskRepository.findById(id)
                .filter(task -> isAdmin || task.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        Project project = currentTask.getProject();
        WorkSpace workSpace = currentTask.getWorkSpace();

        Member currentMember = null;
        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.DELETE_TASKS),
                false
        );

        Member currentWorkspaceMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.MODIFY_ALL_PROJECT),
                false
        );

        if (currentProjectMember != null) currentMember = currentProjectMember;
        else if (currentWorkspaceMember != null) currentMember = currentWorkspaceMember;
        else throw new CustomException("This user can not do this action");

        taskRepository.delete(currentTask);
        return true;
    }

    @Override
    public Boolean softDelete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Task currentTask = taskRepository.findById(id)
                .filter(task -> isAdmin || task.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        Project project = currentTask.getProject();
        WorkSpace workSpace = currentTask.getWorkSpace();

        Member currentMember = null;
        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.DELETE_TASKS),
                false
        );

        Member currentWorkspaceMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.MODIFY_ALL_PROJECT),
                false
        );

        if (currentProjectMember != null) currentMember = currentProjectMember;
        else if (currentWorkspaceMember != null) currentMember = currentWorkspaceMember;
        else throw new CustomException("This user can not do this action");

        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();
        currentTask.setDeletedAt(currentTime);
        taskRepository.delete(currentTask);
        return true;
    }

    @Override
    public TaskResponseDto getOne(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Task currentTask = taskRepository.findById(id)
                .filter(task -> isAdmin || task.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        Project project = currentTask.getProject();

        WorkSpace workSpace = currentTask.getWorkSpace();

        Member currentMember = memberService.checkProjectAndWorkspaceBrowserPermission(currentUser, project, null);

        return ModelMapperUtil.mapOne(currentTask, TaskResponseDto.class);
    }

    @Override
    public PageResponse<TaskResponseDto> getPageByProject(SearchParamRequestDto searchParam, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Long userId = currentUser.getId();
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


        Specification<Task> projectSpecification = (Root<Task> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<Task, Project> projectJoin = root.join("project");
            return criteriaBuilder.equal(projectJoin.get("id"), project.getId());
        };

        Specification<Task> filterSpecification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "createdAt"));

        Specification<Task> specification = Specification.where(projectSpecification)
                .and(filterSpecification);

        Page<Task> page = taskRepository.findAll(specification, pageable);
        List<TaskResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), TaskResponseDto.class);

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
    public PageResponse<TaskResponseDto> getToday(Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Long userId = currentUser.getId();
        List<Timestamp> timestamps = timeUtil.get24HCurrentUTCTimestamp();
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


        SearchParamRequestDto searchParam = new SearchParamRequestDto();
        searchParam.setSortBy("position");
        searchParam.setSortDirectionAsc(true);

        FilterCriteriaRequestDto assigneeFilterCriteriaRequestDto = new FilterCriteriaRequestDto();
        assigneeFilterCriteriaRequestDto.setOperation(FilterOperator.EQUAL);
        assigneeFilterCriteriaRequestDto.setKey("assignee.user.id");
        assigneeFilterCriteriaRequestDto.setValue(currentUser.getId().toString());

        FilterCriteriaRequestDto isCompletedFilterCriteriaRequestDto = new FilterCriteriaRequestDto();
        isCompletedFilterCriteriaRequestDto.setOperation(FilterOperator.EQUAL);
        isCompletedFilterCriteriaRequestDto.setKey("isCompleted");
        isCompletedFilterCriteriaRequestDto.setValue(String.valueOf(false));

        FilterCriteriaRequestDto timeStampFilterCriteriaRequestDto = new FilterCriteriaRequestDto();
//        endAtFilterCriteriaRequestDto.setOperation(FilterOperator.BETWEEN);
//        endAtFilterCriteriaRequestDto.setKey("endAt");
        timeStampFilterCriteriaRequestDto.setValues(timestamps.stream().map(ts -> String.valueOf(ts.getTime())).toList());
        timeStampFilterCriteriaRequestDto.setSpecificTimestampFilter(true);

        List<FilterCriteriaRequestDto> filterCriteriaRequestDtos = new ArrayList<>();
        filterCriteriaRequestDtos.add(assigneeFilterCriteriaRequestDto);
        filterCriteriaRequestDtos.add(isCompletedFilterCriteriaRequestDto);
        filterCriteriaRequestDtos.add(timeStampFilterCriteriaRequestDto);

        searchParam.setFilters(filterCriteriaRequestDtos);

        return getPageByProject(searchParam, projectId);
    }

    // Utility methods
    private Member checkAssignee(Member currentMember, Project project, Long assigneeId) {
        if (!currentMember.getRole().getProjectPermissions().contains(ProjectPermission.ASSIGN_TASKS) &&
                !currentMember.getRole().getWorkSpacePermissions().contains(WorkSpacePermission.MODIFY_ALL_PROJECT)
        ) throw new CustomException("User don't have permission to assign member tasks");

        return project.getMembers().stream()
                .filter(m -> m.getId().equals(assigneeId) &&
                        m.getStatus().equals(MemberStatus.ACTIVE) &&
                        m.getMemberFor().equals(EntityBelongsTo.PROJECT) &&
                        m.getRole().getProjectPermissions().contains(ProjectPermission.ASSIGNABLE_USER))
                .findFirst()
                .orElse(null);
    }

    private Status checkStatus(Project project, Long statusId) {
        return project.getStatuses().stream()
                .filter(s -> s.getId().equals(statusId)
                        && (s.getIsFromAny() || s.getIsFromStart()))
                .findFirst()
                .orElseGet(() -> project.getStatuses().stream()
                        .filter(Status::getIsFromStart)
                        .min(Comparator.comparingLong(Status::getPosition))
                        .orElseThrow(() -> new ResourceNotFoundException("Status", "id", statusId)));
    }

    private Priority checkPriority(Project project, Long priorityId) {
        return project.getPriorities().stream()
                .filter(p -> p.getId().equals(priorityId))
                .findFirst()
                .orElse(null);
    }

    private List<Timestamp> checkStartAndEndTime(Member currentMember, Timestamp startAt, Timestamp endAt) {
        if (!currentMember.getRole().getProjectPermissions().contains(ProjectPermission.SCHEDULE_TASKS))
            throw new CustomException("User does not have schedule tasks permission!");

        if (startAt != null && endAt != null && endAt.before(startAt))
            throw new CustomException("End time cannot be before start time!");

        return Arrays.asList(startAt, endAt);
    }

    private TaskType checkTaskType(Project project, Long taskTypeId) {
        return project.getTaskTypes().stream()
                .filter(t -> t.getId().equals(taskTypeId))
                .findFirst()
                .orElseGet(() -> project.getTaskTypes().stream()
                        .filter(t -> "Task".equals(t.getName()))
                        .findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("Task type", "name", "Task")));
    }

    private Set<Label> checkLabels(Project project, Set<Long> labelIds) {
        if (labelIds == null || labelIds.isEmpty()) {
            return Collections.emptySet();
        }

        return labelIds.stream()
                .map(labelId -> project.getLabels().stream()
                        .filter(l -> l.getId().equals(labelId))
                        .findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("Label", "id", labelId)))
                .collect(Collectors.toSet());
    }

    private Task checkParentTask(Project project, Long taskId) {
        if (taskId == null) {
            return null;
        }

        return project.getTasks().stream()
                .filter(task -> Objects.equals(task.getId(), taskId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
    }

    public Long calculateNewPositionForTask(RePositionRequestDto rePositionReq, Project project, Task currentTask) {
        if (rePositionReq.getPreviousItemId() != null) {
            Long newPositionBaseOnPrevious = handlePreviousTaskPosition(rePositionReq.getPreviousItemId(), currentTask, project);
            if (newPositionBaseOnPrevious != null)
                return newPositionBaseOnPrevious;
        } else if (rePositionReq.getNextItemId() != null) {
            Long newPositionBaseOnNext = handleNextTaskPosition(rePositionReq.getNextItemId(), currentTask, project);
            if (newPositionBaseOnNext != null)
                return newPositionBaseOnNext;
        }

        throw new CustomException("Both previous and next positions cannot be null.");
    }

    private Long handlePreviousTaskPosition(Long previousTaskId, Task currentTask, Project project) {
        Optional<Task> previousTaskOpt = project.getTasks().stream()
                .filter(task -> task.getId().equals(previousTaskId))
                .findFirst();

        if (previousTaskOpt.isEmpty()) {
            return null;
        }

        long previousTaskPosition = previousTaskOpt.get().getPosition();

        Long nextTaskPosition = project.getTasks().stream()
                .map(Task::getPosition)
                .filter(position -> position > previousTaskPosition)
                .min(Long::compare)
                .orElse(roundDownToSignificant(previousTaskPosition + DEFAULT_POSITION_STEP));

        if (nextTaskPosition - previousTaskPosition <= 1) {
            repositionAllTasks(project); // This will reorder tasks

            long updatedPreviousTaskPosition = project.getTasks().stream()
                    .filter(task -> task.getId().equals(previousTaskId))
                    .map(Task::getPosition)
                    .findFirst()
                    .orElse(0L);

            nextTaskPosition = project.getTasks().stream()
                    .map(Task::getPosition)
                    .filter(position -> position > updatedPreviousTaskPosition)
                    .min(Long::compare)
                    .orElse(roundDownToSignificant(updatedPreviousTaskPosition + DEFAULT_POSITION_STEP));

            return (updatedPreviousTaskPosition + nextTaskPosition) / 2;
        }

        return (previousTaskPosition + nextTaskPosition) / 2;
    }

    // Function to round down to the nearest "significant" value, like 1,000,000 or 10,000
    private long roundDownToSignificant(long value) {
        if (value <= 0) return 0;
        int magnitude = (int) Math.log10(value);  // Get the number of digits - 1
        long factor = (long) Math.pow(10, magnitude); // Calculate the power of 10 based on magnitude
        return (value / factor) * factor; // Round down by removing less significant digits
    }

    private Long handleNextTaskPosition(Long nextTaskId, Task currentTask, Project project) {
        Optional<Task> nextTaskOpt = project.getTasks().stream()
                .filter(task -> task.getId().equals(nextTaskId))
                .findFirst();

        if (nextTaskOpt.isEmpty()) {
            return null;
        }

        final Long nextTaskPosition = nextTaskOpt.get().getPosition();

        long previousTaskPosition = project.getTasks().stream()
                .map(Task::getPosition)
                .filter(position -> position < nextTaskPosition)
                .max(Long::compare)
                .orElse(0L);

        if (nextTaskPosition - previousTaskPosition <= 1) {
            repositionAllTasks(project); // This will reorder tasks

            // After repositioning, refetch the previous and next task positions
            final Long updatedNextTaskPosition = project.getTasks().stream()
                    .filter(task -> task.getId().equals(nextTaskId)) // Fetch the new position of the previous task by ID
                    .map(Task::getPosition)
                    .findFirst()
                    .orElse(0L); // Default to 0 if no previous task found

            previousTaskPosition = project.getTasks().stream()
                    .map(Task::getPosition)
                    .filter(position -> position < updatedNextTaskPosition)
                    .max(Long::compare)
                    .orElse(roundDownToSignificant(updatedNextTaskPosition + DEFAULT_POSITION_STEP));

            return (updatedNextTaskPosition + previousTaskPosition) / 2;
        }

        return (previousTaskPosition + nextTaskPosition) / 2;
    }

    private void repositionAllTasks(Project project) {
        List<Task> orderedTasks = project.getTasks().stream()
                .sorted(Comparator.comparing(Task::getPosition))
                .collect(Collectors.toList());

        for (int i = 0; i < orderedTasks.size(); i++) {
            Task taskToReposition = orderedTasks.get(i);
            taskToReposition.setPosition(RepositionUtil.calculateNewLastPosition(i));
        }

        taskRepository.saveAll(orderedTasks);
    }

    private ActivityLog activityLogTaskTemplate(Task task, User user, Member member, String content) {
        ActivityLog activityLogTemplate = new ActivityLog();
        activityLogTemplate.setTask(task);
        activityLogTemplate.setUser(user);
        activityLogTemplate.setMember(member);
        activityLogTemplate.setUserText(member.getUser().getFirstName() + " " + member.getUser().getLastName());
        activityLogTemplate.setSystemInitial(true);
        activityLogTemplate.setSystemRequired(false);
        activityLogTemplate.setType(ActivityLogType.TASK_HISTORY);
        activityLogTemplate.setTask(task);
        activityLogTemplate.setContent(content);

        return activityLogTemplate;
    }
}
