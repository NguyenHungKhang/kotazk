package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.task.TaskRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
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

        if (!currentMember.getRole().getProjectPermissions().contains(ProjectPermission.CREATE_TASKS))
            throw new CustomException("This user do not have permission to create task in this project");

        WorkSpace currentWorkSpace = project.getWorkSpace();
        Member assignee = checkAssignee(currentMember, project, taskRequestDto.getAssigneeId());
        Member reporter = null;
        Set<Collectors> collaborators = new HashSet<>();
        Status status = checkStatus(project, taskRequestDto.getStatusId());
        Priority priority = checkPriority(project, taskRequestDto.getPriorityId());
        Long timeEstimate = taskRequestDto.getTimeEstimate();
        Boolean isCompleted = taskRequestDto.getIsCompleted();

        List<Timestamp> startAndEndTime = checkStartAndEndTime(currentMember, taskRequestDto.getStartAt(), taskRequestDto.getEndAt());
        Timestamp startAt = startAndEndTime.get(0);
        Timestamp endAt = startAndEndTime.get(1);

        TaskType taskType = checkTaskType(project, taskRequestDto.getTaskTypeId());
        Set<Label> labels = checkLabels(project, taskRequestDto.getLabelIds());

        Task newTask = Task.builder()
                .name(taskRequestDto.getName())
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
                .build();

        Task savedTask = taskRepository.save(newTask);

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
                project.getId(),
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

        Optional.ofNullable(taskRequestDto.getAssigneeId())
                .ifPresent(assigneeId -> currentTask.setAssignee(checkAssignee(currentMember, project, assigneeId)));

        Optional.ofNullable(taskRequestDto.getStatusId())
                .ifPresent(statusId -> currentTask.setStatus(checkStatus(project, statusId)));

        Optional.ofNullable(taskRequestDto.getPriorityId())
                .ifPresent(priorityId -> currentTask.setPriority(checkPriority(project, priorityId)));

        Optional.ofNullable(taskRequestDto.getTimeEstimate())
                .ifPresent(currentTask::setTimeEstimate);

        Optional.ofNullable(taskRequestDto.getIsCompleted())
                .ifPresent(currentTask::setIsCompleted);

        if (taskRequestDto.getStartAt() != null || taskRequestDto.getEndAt() != null) {
            Timestamp startAt = Optional.ofNullable(taskRequestDto.getStartAt()).orElse(currentTask.getStartAt());
            Timestamp endAt = Optional.ofNullable(taskRequestDto.getEndAt()).orElse(currentTask.getEndAt());

            List<Timestamp> startAndEndTime = checkStartAndEndTime(currentMember, startAt, endAt);
            currentTask.setStartAt(startAndEndTime.get(0));
            currentTask.setEndAt(startAndEndTime.get(1));
        }

        Optional.ofNullable(taskRequestDto.getTaskTypeId())
                .ifPresent(taskTypeId -> currentTask.setTaskType(checkTaskType(project, taskTypeId)));

        Optional.ofNullable(taskRequestDto.getLabelIds())
                .filter(labelIds -> !labelIds.isEmpty())
                .ifPresent(labelIds -> currentTask.setLabels(checkLabels(project, labelIds)));

        Task savedTask = taskRepository.save(currentTask);

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

        Member currentMember = memberService.checkProjectBrowserPermission(currentUser, project, null);

        return ModelMapperUtil.mapOne(currentTask, TaskResponseDto.class);
    }

    @Override
    public PageResponse<TaskResponseDto> getPageByProject(SearchParamRequestDto searchParam, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Long userId = currentUser.getId();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        Member currentMember = null;

        if (!isAdmin)
            currentMember = memberService.checkProjectMember(
                    currentUser.getId(),
                    project.getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(ProjectPermission.BROWSE_PROJECT),
                    true
            );

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

    // Utility methods
    private Member checkAssignee(Member currentMember, Project project, Long assigneeId) {
        if (!currentMember.getRole().getProjectPermissions().contains(ProjectPermission.ASSIGN_TASKS) &&
                !currentMember.getRole().getWorkSpacePermissions().contains(WorkSpacePermission.MODIFY_ALL_PROJECT)
        )
            return null;

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
}
