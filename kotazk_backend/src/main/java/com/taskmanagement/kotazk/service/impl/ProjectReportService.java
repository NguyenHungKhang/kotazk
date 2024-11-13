package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.RePositionRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.projectReport.ProjectReportRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.common.RePositionResponseDto;
import com.taskmanagement.kotazk.payload.response.priority.PriorityResponseDto;
import com.taskmanagement.kotazk.payload.response.projectReport.ProjectReportResponseDto;
import com.taskmanagement.kotazk.repository.IPriorityRepository;
import com.taskmanagement.kotazk.repository.IProjectReportRepository;
import com.taskmanagement.kotazk.repository.IProjectRepository;
import com.taskmanagement.kotazk.repository.ITaskRepository;
import com.taskmanagement.kotazk.service.ICustomizationService;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.IPriorityService;
import com.taskmanagement.kotazk.service.IProjectReportService;
import com.taskmanagement.kotazk.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProjectReportService implements IProjectReportService {
    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private IProjectReportRepository projectReportRepository;
    @Autowired
    private ITaskRepository taskRepository;
    @Autowired
    private IMemberService memberService = new MemberService();
    @Autowired
    private final BasicSpecificationUtil<Priority> specificationUtil = new BasicSpecificationUtil<>();
    @Autowired
    private TimeUtil timeUtil;

    @Override
    public List<ProjectReport> initialTaskType() {
        return null;
    }

    @Override
    public ProjectReportResponseDto create(ProjectReportRequestDto projectReportRequestDto) {
        System.out.println(projectReportRequestDto);
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Project project = projectRepository.findById(projectReportRequestDto.getProjectId())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectReportRequestDto.getProjectId()));
        WorkSpace workSpace = project.getWorkSpace();

        Member currentMember = checkManageReport(currentUser, project);

        ProjectReportRequestDto validatedprojectReportRequestDto = checkReportValid(projectReportRequestDto);

        if(validatedprojectReportRequestDto == null)
            throw new CustomException("Invalid input");

        ProjectReport newProjectReport = ProjectReport.builder()
                .project(project)
                .workspace(workSpace)
                .name(validatedprojectReportRequestDto.getName())
                .colorMode(validatedprojectReportRequestDto.getColorMode())
                .xType(validatedprojectReportRequestDto.getXType())
                .subXType(validatedprojectReportRequestDto.getSubXType())
                .groupedBy(validatedprojectReportRequestDto.getGroupedBy())
                .yType(validatedprojectReportRequestDto.getYType())
                .fromWhen(validatedprojectReportRequestDto.getFromWhen())
                .toWhen(validatedprojectReportRequestDto.getToWhen())
                .between(validatedprojectReportRequestDto.getBetween())
                .type(validatedprojectReportRequestDto.getType())
                .build();

        ProjectReport savedProjectReport = projectReportRepository.save(newProjectReport);

        return ModelMapperUtil.mapOne(savedProjectReport, ProjectReportResponseDto.class);
    }

    @Override
    public ProjectReportResponseDto update(Long id, ProjectReportRequestDto projectReportRequestDto) {
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
    public ProjectReportResponseDto getOne(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        ProjectReport currentProjectReport = projectReportRepository.findById(id)
                .filter(pr -> isAdmin || pr.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project report", "id", id));
        Project project = Optional.of(currentProjectReport.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", currentProjectReport.getProject().getId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin) memberService.checkProjectAndWorkspaceBrowserPermission(currentUser, project, null);

        return ModelMapperUtil.mapOne(currentProjectReport, ProjectReportResponseDto.class);
    }

    @Override
    public PageResponse<ProjectReportResponseDto> getPageByProject(SearchParamRequestDto searchParam, Long projectId) {
        return null;
    }

    // Utility func

    private Member checkManageReport(User currentUser, Project project) {
        Member currentMember = null;
        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.MANAGE_REPORT),
                false
        );


        if (currentProjectMember != null) return currentProjectMember;
        else throw new CustomException("This user can not do this action");
    }

    private ProjectReportRequestDto checkReportValid(ProjectReportRequestDto projectReportRequestDto) {
        switch (projectReportRequestDto.getType()) {
            case BAR_CHART, LINE, PIE:
                if (projectReportRequestDto.getXType() == null || projectReportRequestDto.getYType() == null)
                    return null;
                projectReportRequestDto.setGroupedBy(null);
                projectReportRequestDto.setFromWhen(null);
                projectReportRequestDto.setSubXType(null);
                projectReportRequestDto.setToWhen(null);
                projectReportRequestDto.setBetween(null);
                return projectReportRequestDto;
            case GROUPED_BAR, STACKED_BAR:
                if (projectReportRequestDto.getXType() == null || projectReportRequestDto.getYType() == null || projectReportRequestDto.getGroupedBy() == null)
                    return null;
                projectReportRequestDto.setFromWhen(null);
                projectReportRequestDto.setSubXType(null);
                projectReportRequestDto.setToWhen(null);
                projectReportRequestDto.setBetween(null);
                return projectReportRequestDto;
            case BURN_UP, BURN_DOWN:
                if (projectReportRequestDto.getXType() == null ||
                        projectReportRequestDto.getYType() == null ||
                        projectReportRequestDto.getGroupedBy() == null ||
                        projectReportRequestDto.getSubXType() == null)
                    return null;
                if (!Set.of(ProjectXTypeReport.DAY,
                                ProjectXTypeReport.WEEK,
                                ProjectXTypeReport.MONTH,
                                ProjectXTypeReport.YEAR)
                        .contains(projectReportRequestDto.getXType()))
                    return null;
                if(projectReportRequestDto.getSubXType() == ProjectSubXTypeReport.BETWEEN && projectReportRequestDto.getBetween() != null) {
                    projectReportRequestDto.setFromWhen(null);
                    projectReportRequestDto.setToWhen(null);
                    return projectReportRequestDto;
                } else if(projectReportRequestDto.getSubXType() == ProjectSubXTypeReport.FROM_TO && projectReportRequestDto.getFromWhen() != null && projectReportRequestDto.getToWhen() != null) {
                    if(projectReportRequestDto.getFromWhen().before(projectReportRequestDto.getToWhen()))
                        return null;
                    projectReportRequestDto.setBetween(null);
                    return projectReportRequestDto;
                } else return null;
            case NUMBER:
                if (projectReportRequestDto.getYType() == null)
                    return null;
                projectReportRequestDto.setXType(null);
                projectReportRequestDto.setGroupedBy(null);
                projectReportRequestDto.setFromWhen(null);
                projectReportRequestDto.setSubXType(null);
                projectReportRequestDto.setToWhen(null);
                projectReportRequestDto.setBetween(null);
                return projectReportRequestDto;
            default:
                return null;
        }

    }
}
