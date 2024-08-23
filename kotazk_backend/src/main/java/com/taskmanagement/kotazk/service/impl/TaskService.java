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
import com.taskmanagement.kotazk.util.BasicSpecificationUtil;
import com.taskmanagement.kotazk.util.ModelMapperUtil;
import com.taskmanagement.kotazk.util.SecurityUtil;
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
    private IMemberService memberService = new MemberService();
    @Autowired
    private final BasicSpecificationUtil<Task> specificationUtil = new BasicSpecificationUtil<>();


    @Override
    public TaskResponseDto create(TaskRequestDto taskRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        Project currentProject = projectRepository.findById(taskRequestDto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", taskRequestDto.getProjectId()));
        Member currentMember = memberService.checkProjectMember(
                currentUser.getId(),
                currentProject.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                new ArrayList<>(),
                true
        );

        if (!currentMember.getRole().getProjectPermissions().contains(ProjectPermission.CREATE_TASKS))
            throw new CustomException("This user do not have permission to create task in this project");

        WorkSpace currentWorkSpace = currentProject.getWorkSpace();
        Member assignee = null;
        Member reporter = null;
        Set<Collectors> collaborators = new HashSet<>();
        Status status = null;
        Priority priority = null;
        Long timeEstimate = taskRequestDto.getTimeEstimate();
        Boolean isCompleted = taskRequestDto.getIsCompleted();
        Timestamp startAt = null;
        Timestamp endAt = null;
        TaskType taskType;
        Set<Label> labels = new HashSet<>();

        if (taskRequestDto.getAssigneeId() != null) {
            if (currentMember.getRole().getProjectPermissions().contains(ProjectPermission.ASSIGN_TASKS)) {
                assignee = memberService.checkProjectMember(
                        currentUser.getId(),
                        currentProject.getId(),
                        Collections.singletonList(MemberStatus.ACTIVE),
                        Collections.singletonList(ProjectPermission.ASSIGNABLE_USER),
                        true
                );
            }
        }

        if (taskRequestDto.getStatusId() != null) {
            status = statusRepository.findById(taskRequestDto.getStatusId())
                    .orElseThrow(() -> new ResourceNotFoundException("Status", "id", taskRequestDto.getStatusId()));
            if (!Objects.equals(status.getProject().getId(), currentProject.getId()))
                throw new CustomException("This status not found!");
            if (!status.getIsFromAny() && !status.getIsFromStart())
                throw new CustomException("This status is not receive task from any source or from start!");
        } else {
            status = currentProject.getStatuses().stream()
                    .filter(Status::getIsFromStart)
                    .min(Comparator.comparingLong(Status::getPosition))
                    .orElse(null);
        }

        if (taskRequestDto.getPriorityId() != null) {
            priority = priorityRepository.findById(taskRequestDto.getPriorityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Priority", "id", taskRequestDto.getPriorityId()));
            if (!Objects.equals(priority.getProject().getId(), currentProject.getId()))
                throw new CustomException("This priority not found!");
        }

        if (taskRequestDto.getEndAt() != null) {
            if (currentMember.getRole().getProjectPermissions().contains(ProjectPermission.SCHEDULE_TASKS)) {
                endAt = taskRequestDto.getEndAt();
            }
        }

        if (taskRequestDto.getStartAt() != null) {
            if (currentMember.getRole().getProjectPermissions().contains(ProjectPermission.SCHEDULE_TASKS)) {
                startAt = taskRequestDto.getStartAt();
            }
        }

        if (taskRequestDto.getLabelIds() != null) {
            taskRequestDto.getLabelIds().forEach(labelId -> {
                Label label = labelRepository.findById(labelId)
                        .orElseThrow(() -> new ResourceNotFoundException("Label", "id", labelId));
                if (!Objects.equals(label.getProject().getId(), currentProject.getId()))
                    throw new CustomException("This label not found!");
                labels.add(label);
            });
        }

        // Add compare startAt and endAt if not null (combine with project's start day and project's end day)

        if (taskRequestDto.getTaskTypeId() != null)
            taskType = currentProject.getTaskTypes()
                    .stream()
                    .filter(t -> t.getId().equals(taskRequestDto.getTaskTypeId()))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Task type", "id", taskRequestDto.getTaskTypeId()));
        else taskType = currentProject.getTaskTypes()
                .stream()
                .filter(t -> "Task".equals(t.getName()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Task type", "name", "Task"));


        Task newTask = Task.builder()
                .name(taskRequestDto.getName())
                .workSpace(currentWorkSpace)
                .project(currentProject)
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
                .position((long) currentProject.getTasks().size())
                .build();

        Task savedTask = taskRepository.save(newTask);

        return ModelMapperUtil.mapOne(savedTask, TaskResponseDto.class);
    }

    @Override
    public TaskResponseDto update(Long id, TaskRequestDto taskRequestDto) {
        return null;
    }

    @Override
    public Boolean delete(Long id) {
        return null;
    }

    @Override
    public Boolean softDelete(Long id) {
        return null;
    }

    @Override
    public Boolean archive(Long id) {
        return null;
    }

    @Override
    public Boolean restore(Long id) {
        return null;
    }

    @Override
    public TaskResponseDto getOne(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        Task currentTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        Project project = currentTask.getProject();
        Member currentMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.BROWSE_PROJECT),
                true
        );

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
}
