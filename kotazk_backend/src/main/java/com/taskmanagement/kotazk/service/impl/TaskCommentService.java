package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.MemberStatus;
import com.taskmanagement.kotazk.entity.enums.ProjectPermission;
import com.taskmanagement.kotazk.entity.enums.Role;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.task.TaskRequestDto;
import com.taskmanagement.kotazk.payload.request.taskComment.TaskCommentRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.task.TaskResponseDto;
import com.taskmanagement.kotazk.payload.response.taskComment.TaskCommentResponseDto;
import com.taskmanagement.kotazk.repository.IProjectRepository;
import com.taskmanagement.kotazk.repository.ITaskCommentRepository;
import com.taskmanagement.kotazk.repository.ITaskRepository;
import com.taskmanagement.kotazk.repository.ITaskTypeRepository;
import com.taskmanagement.kotazk.service.ICustomizationService;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.ITaskCommentService;
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

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TaskCommentService implements ITaskCommentService {
    @Autowired
    private ITaskTypeRepository taskTypeRepository;
    @Autowired
    private ITaskRepository taskRepository;
    @Autowired
    private ITaskCommentRepository taskCommentRepository;
    @Autowired
    private IMemberService memberService = new MemberService();
    @Autowired
    private final BasicSpecificationUtil<TaskComment> specificationUtil = new BasicSpecificationUtil<>();
    @Autowired
    private TimeUtil timeUtil;

    @Override
    public TaskCommentResponseDto create(TaskCommentRequestDto taskCommentRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Task task = taskRepository.findById(taskCommentRequestDto.getTaskId())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskCommentRequestDto.getTaskId()));
        Project project = task.getProject();
        WorkSpace workSpace = project.getWorkSpace();

        Member currentMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                new ArrayList<>(),
                true
        );

        if (!isAdmin && !currentMember.getRole().getProjectPermissions().contains(ProjectPermission.ADD_COMMENT))
            throw new CustomException("This user do not have permission to create comment in this project");

        TaskComment taskComment = TaskComment.builder()
                .content(taskCommentRequestDto.getContent())
                .task(task)
                .user(currentUser)
                .member(currentMember)
                .build();

        TaskComment savedTaskComment = taskCommentRepository.save(taskComment);

        return ModelMapperUtil.mapOne(savedTaskComment, TaskCommentResponseDto.class);
    }

    @Override
    public TaskCommentResponseDto update(Long id, TaskCommentRequestDto taskCommentRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        TaskComment taskComment = taskCommentRepository.findById(id)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Task comment", "id", id));
        Task task = taskComment.getTask();
        Project project = task.getProject();
        WorkSpace workSpace = project.getWorkSpace();

        Member currentMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                new ArrayList<>(),
                true
        );

        if (!isAdmin && (
                !currentMember.getRole().getProjectPermissions().contains(ProjectPermission.EDIT_ALL_COMMENT) ||
                        (taskComment.getMember().getId() == currentMember.getId() && !currentMember.getRole().getProjectPermissions().contains(ProjectPermission.EDIT_OWN_COMMENT))
        ))
            throw new CustomException("This user do not have permission to update comment in this project");

        taskComment.setContent(taskCommentRequestDto.getContent());

        TaskComment savedTaskComment = taskCommentRepository.save(taskComment);

        return ModelMapperUtil.mapOne(savedTaskComment, TaskCommentResponseDto.class);
    }

    @Override
    public Boolean delete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        TaskComment taskComment = taskCommentRepository.findById(id)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Task comment", "id", id));
        Task task = taskComment.getTask();
        Project project = task.getProject();
        WorkSpace workSpace = project.getWorkSpace();

        Member currentMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                new ArrayList<>(),
                true
        );

        if (!isAdmin && (
                !currentMember.getRole().getProjectPermissions().contains(ProjectPermission.DELETE_ALL_COMMENT) &&
                        (taskComment.getMember().getId() == currentMember.getId() && !currentMember.getRole().getProjectPermissions().contains(ProjectPermission.DELETE_OWN_COMMENT))
        ))
            throw new CustomException("This user do not have permission to delete comment in this project");

        taskCommentRepository.deleteById(taskComment.getId());
        return true;

    }

    @Override
    public Boolean softDelete(Long id) {
        return null;
    }

    @Override
    public TaskCommentResponseDto getOne(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        TaskComment taskComment = taskCommentRepository.findById(id)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Task comment", "id", id));
        Task task = taskComment.getTask();
        Project project = task.getProject();
        WorkSpace workSpace = project.getWorkSpace();

        Member currentMember = null;
        if (!isAdmin) memberService.checkProjectAndWorkspaceBrowserPermission(currentUser, project, null);

        return ModelMapperUtil.mapOne(taskComment, TaskCommentResponseDto.class);
    }

    @Override
    public PageResponse<TaskCommentResponseDto> getPageByTask(SearchParamRequestDto searchParam, Long taskId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Long userId = currentUser.getId();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Task task = taskRepository.findById(taskId)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
        Project project = task.getProject();
        WorkSpace workSpace = project.getWorkSpace();

        Member currentMember = null;
        if (!isAdmin)
            currentMember = memberService.checkProjectAndWorkspaceBrowserPermission(currentUser, project, null);


        Specification<TaskComment> projectSpecification = (Root<TaskComment> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<TaskComment, Task> taskJoin = root.join("task");
            return criteriaBuilder.equal(taskJoin.get("id"), task.getId());
        };

        Specification<TaskComment> filterSpecification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "createdAt"));

        Specification<TaskComment> specification = Specification.where(projectSpecification)
                .and(filterSpecification);

        Page<TaskComment> page = taskCommentRepository.findAll(specification, pageable);
        List<TaskCommentResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), TaskCommentResponseDto.class);

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
