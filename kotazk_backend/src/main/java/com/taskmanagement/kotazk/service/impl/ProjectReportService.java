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
import com.taskmanagement.kotazk.payload.response.projectReport.ProjectReportItemResponseDto;
import com.taskmanagement.kotazk.payload.response.projectReport.ProjectReportResponseDto;
import com.taskmanagement.kotazk.repository.*;
import com.taskmanagement.kotazk.service.ICustomizationService;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.IPriorityService;
import com.taskmanagement.kotazk.service.IProjectReportService;
import com.taskmanagement.kotazk.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectReportService implements IProjectReportService {
    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private IProjectReportRepository projectReportRepository;
    @Autowired
    private ISectionRepository sectionRepository;
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
        Section section = sectionRepository.findById(projectReportRequestDto.getSectionId())
                .filter(s -> (isAdmin || s.getDeletedAt() == null) && s.getType().equals(SectionType.REPORT))
                .orElseThrow(() -> new ResourceNotFoundException("Section", "id", projectReportRequestDto.getSectionId()));
        Project project = section.getProject();
        WorkSpace workSpace = project.getWorkSpace();

        Member currentMember = checkManageReport(currentUser, project);

        ProjectReportRequestDto validatedprojectReportRequestDto = checkReportValid(projectReportRequestDto);

        if (validatedprojectReportRequestDto == null)
            throw new CustomException("Invalid input");

        ProjectReport newProjectReport = ProjectReport.builder()
                .section(section)
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
                .position(RepositionUtil.calculateNewLastPosition(section.getProjectReports().size()))
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
        ProjectReportResponseDto projectReportResponseDto = ModelMapperUtil.mapOne(currentProjectReport, ProjectReportResponseDto.class);
        List<ProjectReportItemResponseDto> projectReportItems = getProjectReportItems(projectReportResponseDto, project);
        projectReportResponseDto.setItems(projectReportItems);
        return projectReportResponseDto;
    }

    @Override
    public PageResponse<ProjectReportResponseDto> getPageBySection(SearchParamRequestDto searchParam, Long sectionId) {
        return null;
    }

    // Utility func

    private List<ProjectReportItemResponseDto> getProjectReportItems(ProjectReportResponseDto projectReportResponseDto, Project project) {
        List<ProjectReportItemResponseDto> result = new ArrayList<>();

        if (projectReportResponseDto.getXType().equals(ProjectXTypeReport.STATUS)) {
            List<Status> xObject = project.getStatuses();
            for (Status s : xObject) {
                List<Task> taskObject = project.getTasks()
                        .stream()
                        .filter(t -> Objects.equals(t.getStatus().getId(), s.getId()))
                        .toList();
                String yObject = calculateYObject(projectReportResponseDto, taskObject);

                ProjectReportItemResponseDto newProjectReportItemResponseDto = new ProjectReportItemResponseDto();
                newProjectReportItemResponseDto.setName(s.getName());
                newProjectReportItemResponseDto.getAdditionalFields().put("status", yObject);
                result.add(newProjectReportItemResponseDto);
            }
        } else if (projectReportResponseDto.getXType().equals(ProjectXTypeReport.PRIORITY)) {
            List<Priority> xObject = project.getPriorities();
            for (Priority p : xObject) {
                List<Task> tasks = project.getTasks()
                        .stream()
                        .filter(t -> t.getPriority() != null && Objects.equals(t.getPriority().getId(), p.getId()))
                        .toList();

                ProjectReportItemResponseDto newProjectReportItemResponseDto = new ProjectReportItemResponseDto();
                String yObject;
                List<?> groupedByObjects = projectReportResponseDto.getGroupedBy() != null ? getGroupedByList(project, projectReportResponseDto.getGroupedBy()) : null;

                if (groupedByObjects != null && !groupedByObjects.isEmpty()) {
                    for (Object o : groupedByObjects) {
                        Map<String, Object> groupedData = handleGroupedTasks(projectReportResponseDto, project, tasks, o);
                        groupedData.forEach((key, value) -> {
                            newProjectReportItemResponseDto.getAdditionalFields().put(key, value);
                        });
                    }
                } else {
                    yObject = calculateYObject(projectReportResponseDto, tasks);
                    newProjectReportItemResponseDto.getAdditionalFields().put("priority", yObject);
                }

                newProjectReportItemResponseDto.setName(p.getName());
                result.add(newProjectReportItemResponseDto);
            }
        }

        // More conditions for other group types (ASSIGNEE, TASK_TYPE, etc.) can go here...

        return result;
    }

    private Map<String, Object> handleGroupedTasks(ProjectReportResponseDto projectReportResponseDto, Project project, List<Task> tasks, Object o) {
        Map<String, Object> groupedData = new HashMap<>();
        List<Task> groupedByTasks = tasks;
        String yObject;

        if (projectReportResponseDto.getGroupedBy().equals(ProjectGroupByReport.STATUS)) {
            groupedByTasks = tasks.stream().filter(t -> Objects.equals(t.getStatus().getId(), ((Status) o).getId())).collect(Collectors.toList());
            yObject = calculateYObject(projectReportResponseDto, groupedByTasks);
            groupedData.put(((Status) o).getName(), yObject);
        } else if (projectReportResponseDto.getGroupedBy().equals(ProjectGroupByReport.TASK_TYPE)) {
            groupedByTasks = tasks.stream().filter(t -> Objects.equals(t.getTaskType().getId(), ((TaskType) o).getId())).collect(Collectors.toList());
            yObject = calculateYObject(projectReportResponseDto, groupedByTasks);
            groupedData.put(((TaskType) o).getName(), yObject);
        } else if (projectReportResponseDto.getGroupedBy().equals(ProjectGroupByReport.PRIORITY)) {
            groupedByTasks = tasks.stream().filter(t -> t.getPriority() != null && Objects.equals(t.getPriority().getId(), ((Priority) o).getId())).collect(Collectors.toList());
            yObject = calculateYObject(projectReportResponseDto, groupedByTasks);
            groupedData.put(((Priority) o).getName(), yObject);
        } else if (projectReportResponseDto.getGroupedBy().equals(ProjectGroupByReport.ASSIGNEE)) {
            groupedByTasks = tasks.stream().filter(t -> t.getAssignee() != null && Objects.equals(t.getAssignee().getId(), ((Member) o).getId())).collect(Collectors.toList());
            yObject = calculateYObject(projectReportResponseDto, groupedByTasks);
            groupedData.put(((Member) o).getUser().getFirstName() + " " + ((Member) o).getUser().getLastName(), yObject);
        } else if (projectReportResponseDto.getGroupedBy().equals(ProjectGroupByReport.CREATOR)) {
            groupedByTasks = tasks.stream().filter(t -> t.getCreator() != null && Objects.equals(t.getCreator().getId(), ((Member) o).getId())).collect(Collectors.toList());
            yObject = calculateYObject(projectReportResponseDto, groupedByTasks);
            groupedData.put(((Member) o).getUser().getFirstName() + " " + ((Member) o).getUser().getLastName(), yObject);
        } else if (projectReportResponseDto.getGroupedBy().equals(ProjectGroupByReport.IS_COMPLETED)) {
            groupedByTasks = tasks.stream().filter(t -> Objects.equals(t.getIsCompleted(), ((Boolean) o))).collect(Collectors.toList());
            yObject = calculateYObject(projectReportResponseDto, groupedByTasks);
            groupedData.put(((Boolean) o) ? "Completed" : "Not complete", yObject);
        }

        return groupedData;
    }


    private String calculateYObject(ProjectReportResponseDto projectReportResponseDto, List<Task> groupedByTasks) {
        if (projectReportResponseDto.getYType().equals(ProjectYTypeReport.TASK_COUNT)) {
            return String.valueOf(groupedByTasks.size());
        } else {
            double sum = groupedByTasks.stream()
                    .filter(task -> task.getTimeEstimate() != null)
                    .mapToDouble(Task::getTimeEstimate)
                    .sum();
            return String.valueOf(sum);
        }
    }

    private List<?> getGroupedByList(Project project, ProjectGroupByReport projectGroupByReport) {
        switch (projectGroupByReport) {
            case STATUS:
                return project.getStatuses();
            case PRIORITY:
                return project.getPriorities();
            case TASK_TYPE:
                return project.getTaskTypes();
            case ASSIGNEE:
                return project.getMembers();
            case CREATOR:
                return project.getMembers();
            case IS_COMPLETED:
                return new ArrayList<>(List.of("Completed", "Not completed"));
            default:
                return Collections.emptyList();
        }
    }

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
                if (projectReportRequestDto.getSubXType() == ProjectSubXTypeReport.BETWEEN && projectReportRequestDto.getBetween() != null) {
                    projectReportRequestDto.setFromWhen(null);
                    projectReportRequestDto.setToWhen(null);
                    return projectReportRequestDto;
                } else if (projectReportRequestDto.getSubXType() == ProjectSubXTypeReport.FROM_TO && projectReportRequestDto.getFromWhen() != null && projectReportRequestDto.getToWhen() != null) {
                    if (projectReportRequestDto.getFromWhen().before(projectReportRequestDto.getToWhen()))
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
