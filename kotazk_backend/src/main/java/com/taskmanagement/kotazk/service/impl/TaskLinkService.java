package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.MemberStatus;
import com.taskmanagement.kotazk.entity.enums.ProjectPermission;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.taskLink.TaskLinkRequestDto;
import com.taskmanagement.kotazk.payload.response.activityLog.ActivityLogResponseDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.taskLink.TaskLinkResponseDto;
import com.taskmanagement.kotazk.repository.*;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.ITaskLinkService;
import com.taskmanagement.kotazk.util.BasicSpecificationUtil;
import com.taskmanagement.kotazk.util.ModelMapperUtil;
import com.taskmanagement.kotazk.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TaskLinkService implements ITaskLinkService {
    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private ITaskRepository taskRepository;
    @Autowired
    private ITaskLinkRepository taskLinkRepository;
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
    private final BasicSpecificationUtil<TaskLink> specificationUtil = new BasicSpecificationUtil<>();
    @Override
    public TaskLinkResponseDto save(TaskLinkRequestDto taskLinkRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        Task firstTask = taskRepository.findById(taskLinkRequestDto.getFirstTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskLinkRequestDto.getFirstTaskId()));
        Task secondTask = taskRepository.findById(taskLinkRequestDto.getFirstTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskLinkRequestDto.getFirstTaskId()));

        if (firstTask.getProject().getId() != firstTask.getProject().getId())
            return null;

        Project project = firstTask.getProject();

        Member currentMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.LINK_TASKS),
                true
        );

        Optional<TaskLink> existTaskLink = taskLinkRepository.findFirstByTasksWithSwap(firstTask.getId(), secondTask.getId());
        TaskLink taskLink;
        if (existTaskLink.isEmpty())
            taskLink = new TaskLink();
        else
            taskLink = existTaskLink.get();
        taskLink.setFirstTask(firstTask);
        taskLink.setSecondTask(secondTask);

        TaskLink savedTaskLink = taskLinkRepository.save(taskLink);

        return ModelMapperUtil.mapOne(savedTaskLink, TaskLinkResponseDto.class);
    }

    @Override
    public Boolean delete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        TaskLink taskLink = taskLinkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        Project project = taskLink.getFirstTask().getProject();

        Member currentMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.LINK_TASKS),
                true
        );
        taskLinkRepository.deleteById(id);
        return true;
    }

    @Override
    public List<TaskLinkResponseDto> getAll(SearchParamRequestDto searchParam) {
        User currentUser = SecurityUtil.getCurrentUser();
        Specification<TaskLink> specification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());
        List<TaskLink> activityLogs = taskLinkRepository.findAll(specification);
        return ModelMapperUtil.mapList(activityLogs, TaskLinkResponseDto.class);
    }
}
