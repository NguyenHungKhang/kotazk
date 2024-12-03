package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.FilterCriteriaRequestDto;
import com.taskmanagement.kotazk.payload.request.common.RePositionRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.filterSetting.FilterSettingRequestDto;
import com.taskmanagement.kotazk.payload.request.projectReport.ProjectReportRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.common.RePositionResponseDto;
import com.taskmanagement.kotazk.payload.response.filterSetting.FilterSettingResponseDto;
import com.taskmanagement.kotazk.payload.response.priority.PriorityResponseDto;
import com.taskmanagement.kotazk.payload.response.projectReport.ProjectReportItemNameAndColorResponseDto;
import com.taskmanagement.kotazk.payload.response.projectReport.ProjectReportItemResponseDto;
import com.taskmanagement.kotazk.payload.response.projectReport.ProjectReportResponseDto;
import com.taskmanagement.kotazk.payload.response.tasktype.TaskTypeResponseDto;
import com.taskmanagement.kotazk.repository.*;
import com.taskmanagement.kotazk.service.ICustomizationService;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.IPriorityService;
import com.taskmanagement.kotazk.service.IProjectReportService;
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
    private final BasicSpecificationUtil<ProjectReport> specificationUtil = new BasicSpecificationUtil<>();
    private final BasicSpecificationUtil<Task> taskSpecificationUtil = new BasicSpecificationUtil<>();
    @Autowired
    private TimeUtil timeUtil;

    @Override
    public List<ProjectReport> initialTaskType() {
        return null;
    }

    @Override
    public ProjectReportResponseDto create(ProjectReportRequestDto projectReportRequestDto) {
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

        ProjectReport newProjectReport = new ProjectReport();

        newProjectReport.setSection(section);
        newProjectReport.setProject(project);
        newProjectReport.setWorkspace(workSpace);
        newProjectReport.setName(validatedprojectReportRequestDto.getName());
        newProjectReport.setColorMode(validatedprojectReportRequestDto.getColorMode());
        newProjectReport.setXType(validatedprojectReportRequestDto.getXType());
        newProjectReport.setSubXType(validatedprojectReportRequestDto.getSubXType());
        newProjectReport.setGroupedBy(validatedprojectReportRequestDto.getGroupedBy());
        newProjectReport.setYType(validatedprojectReportRequestDto.getYType());
        newProjectReport.setFromWhen(validatedprojectReportRequestDto.getFromWhen());
        newProjectReport.setToWhen(validatedprojectReportRequestDto.getToWhen());
        newProjectReport.setBetween(validatedprojectReportRequestDto.getBetween());
        newProjectReport.setType(validatedprojectReportRequestDto.getType());
        newProjectReport.setPosition(RepositionUtil.calculateNewLastPosition(section.getProjectReports().size()));

        if (projectReportRequestDto.getFilterSettings() != null) {
            newProjectReport.setFilterSettings(projectReportRequestDto.getFilterSettings()
                    .stream()
                    .map(f -> {
                        checkFilter(f, project, section);
                        return FilterSetting.builder()
                                .projectReport(newProjectReport)
                                .field(f.getField())
                                .values(f.getValues())
                                .operator(f.getOperator())
                                .build();
                    }).toList());
        }

        ProjectReport savedProjectReport = projectReportRepository.save(newProjectReport);

        ProjectReportResponseDto projectReportResponseDto = ModelMapperUtil.mapOne(savedProjectReport, ProjectReportResponseDto.class);
        getProjectReportItems(projectReportResponseDto, project);

        return projectReportResponseDto;
    }

    @Override
    public ProjectReportResponseDto update(Long id, ProjectReportRequestDto projectReportRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        ProjectReport projectReport = projectReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project report", "id", id));
        Section section = projectReport.getSection();
        Project project = section.getProject();
        WorkSpace workSpace = project.getWorkSpace();

        Member currentMember = checkManageReport(currentUser, project);

        ProjectReportRequestDto validatedprojectReportRequestDto = checkReportValid(projectReportRequestDto);

        if (validatedprojectReportRequestDto == null)
            throw new CustomException("Invalid input");

        ProjectReport editedCurrentProject = new ProjectReport();

        editedCurrentProject.setId(projectReport.getId());
        editedCurrentProject.setSection(section);
        editedCurrentProject.setProject(project);
        editedCurrentProject.setWorkspace(workSpace);
        editedCurrentProject.setName(validatedprojectReportRequestDto.getName());
        editedCurrentProject.setColorMode(validatedprojectReportRequestDto.getColorMode());
        editedCurrentProject.setXType(validatedprojectReportRequestDto.getXType());
        editedCurrentProject.setSubXType(validatedprojectReportRequestDto.getSubXType());
        editedCurrentProject.setGroupedBy(validatedprojectReportRequestDto.getGroupedBy());
        editedCurrentProject.setYType(validatedprojectReportRequestDto.getYType());
        editedCurrentProject.setFromWhen(validatedprojectReportRequestDto.getFromWhen());
        editedCurrentProject.setToWhen(validatedprojectReportRequestDto.getToWhen());
        editedCurrentProject.setBetween(validatedprojectReportRequestDto.getBetween());
        editedCurrentProject.setType(validatedprojectReportRequestDto.getType());
        editedCurrentProject.setPosition(projectReport.getPosition());


        if (projectReportRequestDto.getFilterSettings() != null) {
            editedCurrentProject.setFilterSettings(projectReportRequestDto.getFilterSettings()
                    .stream()
                    .map(f -> {
                        checkFilter(f, project, section);
                        return FilterSetting.builder()
                                .projectReport(editedCurrentProject)
                                .field(f.getField())
                                .values(f.getValues())
                                .operator(f.getOperator())
                                .build();
                    }).toList());
        }

        ProjectReport savedProjectReport = projectReportRepository.save(editedCurrentProject);

        ProjectReportResponseDto projectReportResponseDto = ModelMapperUtil.mapOne(savedProjectReport, ProjectReportResponseDto.class);
        getProjectReportItems(projectReportResponseDto, project);

        return projectReportResponseDto;
    }

    @Override
    public Boolean delete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        ProjectReport projectReport = projectReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project report", "id", id));
        Section section = projectReport.getSection();
        Project project = section.getProject();
        WorkSpace workSpace = project.getWorkSpace();

        Member currentMember = checkManageReport(currentUser, project);

        projectReportRepository.deleteById(projectReport.getId());

        return true;
    }

    @Override
    public Boolean softDelete(Long id) {
        return null;
    }

    @Override
    public RePositionResponseDto rePosition(RePositionRequestDto rePositionRequestDto, Long sectionId) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Section section = sectionRepository.findById(sectionId)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Section", "id", sectionId));
        Project project = section.getProject();
        WorkSpace workSpace = project.getWorkSpace();

        Member currentMember = null;
        if (!isAdmin)
            currentMember = checkManageReport(currentUser, project);

        if (!section.getType().equals(SectionType.REPORT))
            throw new CustomException("This section is not a report section");

        Long nextReportPosition = section.getProjectReports().stream()
                .filter(pr -> pr.getId().equals(rePositionRequestDto.getNextItemId()))
                .findFirst()
                .map(ProjectReport::getPosition)
                .orElse(null);

        Long previousReportPosition =  section.getProjectReports().stream()
                .filter(pr -> pr.getId().equals(rePositionRequestDto.getPreviousItemId()))
                .findFirst()
                .map(ProjectReport::getPosition)
                .orElse(null);

        ProjectReport currentReport = section.getProjectReports().stream()
                .filter(pr -> pr.getId().equals(rePositionRequestDto.getCurrentItemId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Project report", "id", rePositionRequestDto.getCurrentItemId()));

        currentReport.setPosition(RepositionUtil.calculateNewPosition(previousReportPosition, nextReportPosition));

        ProjectReport savedProjectReport = projectReportRepository.save(currentReport);

        return RePositionResponseDto.builder()
                .id(savedProjectReport.getId())
                .newPosition(savedProjectReport.getPosition())
                .build();
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
        getProjectReportItems(projectReportResponseDto, project);
        return projectReportResponseDto;
    }

    @Override
    public PageResponse<ProjectReportResponseDto> getPageBySection(SearchParamRequestDto searchParam, Long sectionId) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Section section = sectionRepository.findById(sectionId)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Section", "id", sectionId));
        Project project = Optional.of(section.getProject())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", section.getProject().getId()));
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

        Specification<ProjectReport> projectSpecification = (Root<ProjectReport> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<ProjectReport, Section> projectJoin = root.join("section");
            return criteriaBuilder.equal(projectJoin.get("id"), section.getId());
        };

        Specification<ProjectReport> filterSpecification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Specification<ProjectReport> specification = Specification.where(projectSpecification)
                .and(filterSpecification);

        Page<ProjectReport> page = projectReportRepository.findAll(specification, pageable);
        List<ProjectReportResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), ProjectReportResponseDto.class);
        dtoList = dtoList.stream()
                .map(dtoItem -> {
                    getProjectReportItems(dtoItem, project);
                    return dtoItem;
                }).toList();

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
    public ProjectReportResponseDto previewChart(ProjectReportRequestDto projectReportRequestDto) {
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

        ProjectReportResponseDto projectReportResponseDto = ModelMapperUtil.mapOne(projectReportRequestDto, ProjectReportResponseDto.class);
        getProjectReportItems(projectReportResponseDto, project);

        return projectReportResponseDto;
    }

    // Utility func

    private void getProjectReportItems(ProjectReportResponseDto reportDto, Project project) {
        if (reportDto.getType() == ProjectReportType.NUMBER) {
            List<Task> taskForCount = makeWithFilterSettingDto(project, reportDto.getFilterSettings());
            if (reportDto.getYType() == ProjectYTypeReport.TASK_COUNT)
                reportDto.setNumberValue((double) taskForCount.size());
            else {
                double totalTimeEstimate = taskForCount.stream()
                        .map(task -> task.getTimeEstimate() != null ? task.getTimeEstimate() : 0.0)
                        .mapToDouble(Double::doubleValue)
                        .sum();
                reportDto.setNumberValue(totalTimeEstimate);
            }
            return;
        }

        List<ProjectReportItemResponseDto> reportItems = new ArrayList<>();
        List<ProjectReportItemNameAndColorResponseDto> colorsAndNames = new ArrayList<>();
        boolean colorsGenerated = false;

        List<?> xObjects = switch (reportDto.getXType()) {
            case STATUS -> project.getStatuses();
            case PRIORITY -> project.getPriorities();
            case TASK_TYPE -> project.getTaskTypes();
            case ASSIGNEE, CREATOR -> project.getMembers();
            case IS_COMPLETED -> List.of(true, false);
            default -> throw new IllegalArgumentException("Unsupported XType");
        };

        for (Object xObject : xObjects) {
            List<Task> tasks = filterTasksByXType(project, xObject, reportDto.getXType(), reportDto.getFilterSettings());
            ProjectReportItemResponseDto itemDto = new ProjectReportItemResponseDto();
            List<?> groupedByObjects = reportDto.getGroupedBy() != null ? getGroupedByList(project, reportDto.getGroupedBy()) : null;

            if (groupedByObjects != null && !groupedByObjects.isEmpty()) {
                if (!colorsGenerated) {
                    colorsAndNames = getGroupFieldNamesAndColors(reportDto, groupedByObjects);
                    colorsGenerated = true;
                }
                for (Object groupObj : groupedByObjects) {
                    handleGroupedTasks(reportDto, project, tasks, groupObj)
                            .forEach((key, value) -> itemDto.getAdditionalFields().put(key, Double.valueOf(value.toString())));
                }
            } else {
                String yObject = calculateYObject(reportDto, tasks);
                String name = getNameFromXObject(xObject);
                itemDto.getAdditionalFields().put(reportDto.getXType().toString(), Double.valueOf(yObject));
                addColorAndName(colorsAndNames, xObject, reportDto);
            }

            itemDto.setName(getNameFromXObject(xObject));
            reportItems.add(itemDto);
        }

        reportDto.setColorsAndNames(colorsAndNames);
        reportDto.setItems(reportItems);
    }

    private List<Task> filterTasksByXType(Project project, Object xObject, ProjectXTypeReport xType, List<FilterSettingResponseDto> filterSettingResponseDtos) {
        return makeWithFilterSettingDto(project, filterSettingResponseDtos).stream()
                .filter(task -> switch (xType) {
                    case STATUS -> task.getStatus() != null && task.getStatus().equals(xObject);
                    case PRIORITY -> task.getPriority() != null && task.getPriority().equals(xObject);
                    case TASK_TYPE -> task.getTaskType() != null && task.getTaskType().equals(xObject);
                    case ASSIGNEE -> task.getAssignee() != null && task.getAssignee().equals(xObject);
                    case CREATOR -> task.getCreator() != null && task.getCreator().equals(xObject);
                    case IS_COMPLETED -> task.getIsCompleted() == xObject;
                    default -> false;
                }).toList();
    }

    private String getNameFromXObject(Object xObject) {
        if (xObject instanceof Status s) return s.getName();
        if (xObject instanceof Priority p) return p.getName();
        if (xObject instanceof TaskType t) return t.getName();
        if (xObject instanceof Member m) return m.getUser().getFirstName() + " " + m.getUser().getLastName();
        if (xObject instanceof Boolean b) return b ? "Completed" : "Not complete";
        throw new IllegalArgumentException("Unsupported XObject type");
    }

    private void addColorAndName(List<ProjectReportItemNameAndColorResponseDto> colorsAndNames, Object xObject, ProjectReportResponseDto reportDto) {

        ProjectReportItemNameAndColorResponseDto colorAndName = new ProjectReportItemNameAndColorResponseDto();
        colorAndName.setName(getNameFromXObject(xObject));
        colorAndName.setColor(getColorFromXObject(xObject));
        colorsAndNames.add(colorAndName);

    }

    private String getColorFromXObject(Object xObject) {
        if (xObject instanceof Status s) return s.getCustomization().getBackgroundColor();
        if (xObject instanceof Priority p) return p.getCustomization().getBackgroundColor();
        if (xObject instanceof TaskType t) return t.getCustomization().getBackgroundColor();
        if (xObject instanceof Member m) return getColorBasedOnNumber(m.getId());
        if (xObject instanceof Boolean b) return b ? "#87DD2C" : "#FFA000";
        throw new IllegalArgumentException("Unsupported XObject type for color");
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

    private List<ProjectReportItemNameAndColorResponseDto> getGroupFieldNamesAndColors(ProjectReportResponseDto projectReportResponseDto, List<?> groupedByObjects) {
        List<ProjectReportItemNameAndColorResponseDto> result = new ArrayList<>();

        if (projectReportResponseDto.getGroupedBy().equals(ProjectGroupByReport.STATUS)) {
            for (Object o : groupedByObjects) {
                Status s = (Status) o;
                ProjectReportItemNameAndColorResponseDto current = new ProjectReportItemNameAndColorResponseDto();
                current.setColor(s.getCustomization().getBackgroundColor());
                current.setName(s.getName());
                result.add(current);
            }
        } else if (projectReportResponseDto.getGroupedBy().equals(ProjectGroupByReport.TASK_TYPE)) {
            for (Object o : groupedByObjects) {
                TaskType t = (TaskType) o;
                ProjectReportItemNameAndColorResponseDto current = new ProjectReportItemNameAndColorResponseDto();
                current.setColor(t.getCustomization().getBackgroundColor());
                current.setName(t.getName());
                result.add(current);
            }
        } else if (projectReportResponseDto.getGroupedBy().equals(ProjectGroupByReport.PRIORITY)) {
            for (Object o : groupedByObjects) {
                Priority p = (Priority) o;
                ProjectReportItemNameAndColorResponseDto current = new ProjectReportItemNameAndColorResponseDto();
                current.setColor(p.getCustomization().getBackgroundColor());
                current.setName(p.getName());
                result.add(current);
            }
        } else if (projectReportResponseDto.getGroupedBy().equals(ProjectGroupByReport.ASSIGNEE)) {
            for (Object o : groupedByObjects) {
                Member m = (Member) o;
                ProjectReportItemNameAndColorResponseDto current = new ProjectReportItemNameAndColorResponseDto();
                current.setColor("#888");
                current.setName(m.getUser().getFirstName() + " " + m.getUser().getLastName());
                result.add(current);
            }
        } else if (projectReportResponseDto.getGroupedBy().equals(ProjectGroupByReport.CREATOR)) {
            for (Object o : groupedByObjects) {
                Member m = (Member) o;
                ProjectReportItemNameAndColorResponseDto current = new ProjectReportItemNameAndColorResponseDto();
                current.setColor(getColorBasedOnNumber(m.getId()));
                current.setName(m.getUser().getFirstName() + " " + m.getUser().getLastName());
                result.add(current);
            }
        } else if (projectReportResponseDto.getGroupedBy().equals(ProjectGroupByReport.IS_COMPLETED)) {
            for (Object o : groupedByObjects) {
                Boolean b = (Boolean) o;
                ProjectReportItemNameAndColorResponseDto current = new ProjectReportItemNameAndColorResponseDto();
                current.setColor(b ? "#87DD2C" : "#FFA000");
                current.setName(b ? "Completed" : "Not complete");
                result.add(current);
            }
        }

        return result;
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

    private String getColorBasedOnNumber(long number) {
        List<String> enhancedIconColors = List.of(
                "#f53d3d", // Red
                "#f53d9f", // Pink
                "#8a3df5", // Purple
                "#0d9af2", // Blue
                "#47ebcd", // Green
                "#FFDC49", // Yellow
                "#FFA344", // Orange
                "#f5743d", // Brown
                "#979A9B"  // Grey
        );

        int index = (int) (Math.abs(number) % enhancedIconColors.size());
        return enhancedIconColors.get(index);
    }


    private List<Task> makeWithFilterSettingDto(Project project, List<FilterSettingResponseDto> filterSettingResponseDtos) {
        List<FilterCriteriaRequestDto> filterCriteriaRequestDtos = new ArrayList<>();
        FilterCriteriaRequestDto projectFilterCriteriaRequestDto = new FilterCriteriaRequestDto();
        projectFilterCriteriaRequestDto.setKey("project.id");
        projectFilterCriteriaRequestDto.setOperation(FilterOperator.EQUAL);
        projectFilterCriteriaRequestDto.setValue(String.valueOf(project.getId()));
        filterCriteriaRequestDtos.add(projectFilterCriteriaRequestDto);

        for (FilterSettingResponseDto fs : filterSettingResponseDtos) {
            FilterCriteriaRequestDto filterCriteriaRequestDto = new FilterCriteriaRequestDto();
            filterCriteriaRequestDto.setKey(fs.getField().getFieldName());
            filterCriteriaRequestDto.setOperation(fs.getOperator());
            if (fs.getField().equals(FilterField.START_AT) || fs.getField().equals(FilterField.END_AT)) {
                filterCriteriaRequestDto.setValue(fs.getValues().get(0));
            } else {
                filterCriteriaRequestDto.setValues(fs.getValues());
            }
            filterCriteriaRequestDtos.add(filterCriteriaRequestDto);
        }

        return getTaskByFilter(filterCriteriaRequestDtos);
    }

    private List<Task> getTaskByFilter(List<FilterCriteriaRequestDto> filterCriteriaRequestDtos) {
        Specification<Task> filterSpecification = taskSpecificationUtil.getSpecificationFromFilters(filterCriteriaRequestDtos);

        Specification<Task> specification = filterSpecification;

        List<Task> list = taskRepository.findAll(specification);
        return list;
    }

    private Boolean checkFilter(FilterSettingRequestDto filterSettingRequestDto, Project project, Section section) {
        if (filterSettingRequestDto.getField().equals(FilterField.STATUS.getFieldName()))
            return project.getStatuses().stream().map(s -> s.getId()).toList().containsAll(filterSettingRequestDto.getValues().stream().map(v -> Long.parseLong(v)).toList());
        else if (filterSettingRequestDto.getField().equals(FilterField.PRIORITY.getFieldName()))
            return project.getPriorities().stream().map(p -> p.getId()).toList().containsAll(filterSettingRequestDto.getValues().stream().map(v -> Long.parseLong(v)).toList());
        else if (filterSettingRequestDto.getField().equals(FilterField.TASK_TYPE.getFieldName()))
            return project.getTaskTypes().stream().map(t -> t.getId()).toList().containsAll(filterSettingRequestDto.getValues().stream().map(v -> Long.parseLong(v)).toList());
        return false;
    }
}
