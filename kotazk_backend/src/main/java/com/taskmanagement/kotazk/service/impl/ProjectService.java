package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.Member;
import com.taskmanagement.kotazk.entity.Project;
import com.taskmanagement.kotazk.entity.User;
import com.taskmanagement.kotazk.entity.WorkSpace;
import com.taskmanagement.kotazk.entity.enums.MemberStatus;
import com.taskmanagement.kotazk.entity.enums.WorkSpacePermission;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.project.ProjectRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.project.ProjectResponseDto;
import com.taskmanagement.kotazk.repository.IProjectRepository;
import com.taskmanagement.kotazk.repository.IWorkSpaceRepository;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.IProjectService;
import com.taskmanagement.kotazk.service.IWorkSpaceService;
import com.taskmanagement.kotazk.util.ModelMapperUtil;
import com.taskmanagement.kotazk.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
@Service
@Transactional
public class ProjectService implements IProjectService {
    @Autowired
    private IWorkSpaceRepository workSpaceRepository;
    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private IMemberService memberService = new MemberService();

    @Override
    public ProjectResponseDto create(ProjectRequestDto project) {
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = workSpaceRepository.findById(project.getWorkSpaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", project.getWorkSpaceId()));
        Member currentMember = memberService.checkMemberStatusAndPermission(currentUser.getId(), workSpace.getId(), null, MemberStatus.ACTIVE, String.valueOf(WorkSpacePermission.CREATE_PROJECT));
        Project newProject = ModelMapperUtil.mapOne(project, Project.class);
        newProject.setId(null);
        newProject.setMember(currentMember);

        Project savedProject = projectRepository.save(newProject);
        return ModelMapperUtil.mapOne(savedProject, ProjectResponseDto.class);
    }

    @Override
    public ProjectResponseDto update(Long id, ProjectRequestDto project) {
        Project currentProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("project", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = workSpaceRepository.findById(project.getWorkSpaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", project.getWorkSpaceId()));
//        Member currentMember = memberService.checkMemberStatusAndPermission(currentUser.getId(), workSpace.getId(), null, MemberStatus.ACTIVE, String.valueOf(WorkSpacePermission.CREATE_PROJECT));

        if (project.getName() != null) currentProject.setName(project.getName());
        if (project.getDescription() != null) currentProject.setDescription(project.getDescription());
        if (project.getVisibility() != null) currentProject.setVisibility(project.getVisibility());
        if (project.getStatus() != null) currentProject.setStatus(project.getStatus());
        if (project.getIsPinned() != null) currentProject.setIsPinned(project.getIsPinned());

        Project savedProject = projectRepository.save(currentProject);
        return ModelMapperUtil.mapOne(savedProject, ProjectResponseDto.class);
    }

    @Override
    public Boolean delete(Long id) {
        return null;
    }

    @Override
    public Boolean softDelete(Long id) throws IOException, InterruptedException {
        return null;
    }

    @Override
    public Boolean archive(Long id) throws IOException, InterruptedException {
        return null;
    }

    @Override
    public Boolean restore(Long id) {
        return null;
    }

    @Override
    public ProjectResponseDto getOne(Long id) {
        return null;
    }

    @Override
    public PageResponse<ProjectResponseDto> getList(SearchParamRequestDto searchParam) {
        return null;
    }
}
