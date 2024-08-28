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
import com.taskmanagement.kotazk.payload.response.tasktype.TaskTypeResponseDto;
import com.taskmanagement.kotazk.repository.IProjectRepository;
import com.taskmanagement.kotazk.repository.ITaskTypeRepository;
import com.taskmanagement.kotazk.service.ICustomizationService;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.ITaskTypeService;
import com.taskmanagement.kotazk.util.RepositionUtil;
import com.taskmanagement.kotazk.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private ICustomizationService customizationService = new CustomizationService();
    @Autowired
    private IMemberService memberService = new MemberService();
    @Override
    public List<TaskType> initialTaskType() {
        return List.of(
                createDefaultInitialTaskType("Task", "", RepositionUtil.calculateNewLastPosition(0)),
                createDefaultInitialTaskType("Subtask", "",  RepositionUtil.calculateNewLastPosition(1)),
                createDefaultInitialTaskType("Milestone", "",  RepositionUtil.calculateNewLastPosition(2))
        );
    }

    @Override
    public TaskTypeResponseDto create(TaskTypeRequestDto taskTypeRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Project project = projectRepository.findById(taskTypeRequestDto.getProjectId())
                .filter(p -> isAdmin || p.getDeletedAt() != null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", taskTypeRequestDto.getProjectId()));

        Member currentMember = checkManageTaskTypePermission(currentUser.getId(), project.getId(), project.getWorkSpace().getId());

        Customization customization = Optional.ofNullable(taskTypeRequestDto.getCustomization())
                .map(customizationService::createBuilder)
                .orElse(null);

        Long position = RepositionUtil.calculateNewLastPosition(project.getTaskTypes().size());

        return null;
    }

    @Override
    public TaskTypeResponseDto update(Long id, TaskTypeRequestDto taskTypeRequestDto) {
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
    public RePositionResponseDto rePosition(RePositionRequestDto rePositionRequestDto, Long projectId) {
        return null;
    }

    @Override
    public TaskTypeResponseDto getOne(Long id) {
        return null;
    }

    @Override
    public PageResponse<TaskTypeResponseDto> getPageByWorkSpace(SearchParamRequestDto searchParam, Long projectId) {
        return null;
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
