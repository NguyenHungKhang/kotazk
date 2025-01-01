package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.label.LabelRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.label.LabelResponseDto;
import com.taskmanagement.kotazk.payload.response.priority.PriorityResponseDto;
import com.taskmanagement.kotazk.repository.*;
import com.taskmanagement.kotazk.service.ICustomizationService;
import com.taskmanagement.kotazk.service.ILabelService;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.util.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;
import org.hibernate.jdbc.Work;
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
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@Transactional
public class LabelService implements ILabelService {

    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private ILabelRepository labelRepository;
    @Autowired
    private ICustomizationService customizationService = new CustomizationService();
    @Autowired
    private IMemberService memberService = new MemberService();
    @Autowired
    private final BasicSpecificationUtil<Label> specificationUtil = new BasicSpecificationUtil<>();
    @Autowired
    private TimeUtil timeUtil;
    @Autowired
    private IActivityLogRepository activityLogRepository;
    @Autowired
    private ITaskRepository taskRepository;
    @Override
    public LabelResponseDto create(LabelRequestDto labelRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Project project = projectRepository.findById(labelRequestDto.getProjectId())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", labelRequestDto.getProjectId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = checkManageLabel(currentUser, project, workSpace);

        Customization customization = Optional.ofNullable(labelRequestDto.getCustomization())
                .map(customizationService::createBuilder)
                .orElse(null);

        Label newLabel = Label.builder()
                .name(labelRequestDto.getName())
                .project(project)
                .customization(customization)
                .systemInitial(false)
                .systemRequired(false)
                .build();

        Label savedLabel = labelRepository.save(newLabel);

        return ModelMapperUtil.mapOne(savedLabel, LabelResponseDto.class);
    }

    @Override
    public LabelResponseDto update(Long id, LabelRequestDto labelRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Label currentLabel = labelRepository.findById(id)
                .filter(l -> isAdmin || l.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Label", "id", id));
        Project project =  Optional.of(currentLabel.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", currentLabel.getProject().getId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = checkManageLabel(currentUser, project, workSpace);

        Optional.ofNullable(labelRequestDto.getCustomization()).ifPresent(statusCustomization -> {
            Customization customization = Optional.ofNullable(currentLabel.getCustomization())
                    .orElseGet(() -> {
                        Customization newCustomization = new Customization();
                        currentLabel.setCustomization(newCustomization);
                        return newCustomization;
                    });

            Optional.ofNullable(statusCustomization.getBackgroundColor())
                    .ifPresent(customization::setBackgroundColor);
        });

        Optional.ofNullable(labelRequestDto.getName()).ifPresent(currentLabel::setName);


        Label savedLabel = labelRepository.save(currentLabel);

        return ModelMapperUtil.mapOne(savedLabel, LabelResponseDto.class);
    }

    @Override
    public List<LabelResponseDto> saveList(List<LabelRequestDto> labelRequestDtos, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Project project = projectRepository.findById(projectId)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        WorkSpace workSpace = project.getWorkSpace();

        Member currentMember = null;

        if (!isAdmin)
            currentMember = checkManageLabel(currentUser, project, workSpace);

        AtomicInteger positionIndex = new AtomicInteger();

        Set<Long> incomingLabelIds = new HashSet<>();

        List<Label> labels = labelRequestDtos.stream()
                .map(l -> {
                    Label label = new Label();
                    Optional.ofNullable(l.getId()).ifPresent(id -> {
                        label.setId(id);
                        incomingLabelIds.add(id);
                    });
                    if (l.getProjectId() != projectId)
                        throw new CustomException("Invalid input!");
                    label.setProject(project);
                    label.setName(l.getName());

                    Customization customization = new Customization();
                    customization.setBackgroundColor(l.getCustomization().getBackgroundColor());
                    label.setCustomization(customization);

                    return label;
                }).toList();

        List<Label> deletedLabels = project.getLabels().stream()
                .filter(lb -> {
                    if (!incomingLabelIds.contains(lb.getId()) && lb.getSystemRequired()) {
                        throw new CustomException("Cannot delete system label");
                    }
                    return !incomingLabelIds.contains(lb.getId());
                })
                .collect(Collectors.toList());

        deletedLabels.forEach(label -> {
            List<Task> tasks = label.getTasks().stream().toList();
            if (tasks != null) {
                tasks.forEach(task -> task.setLabels(task.getLabels().stream().filter(l -> l.getId() == label.getId()).collect(Collectors.toSet())));
            }
            taskRepository.saveAll(tasks);
        });

        project.getLabels().clear();
        project.getLabels().addAll(labels);
        List<Label> savedLabels = projectRepository.save(project).getLabels();

        ActivityLog activityLog = activityLogLabelTemplate(project, currentUser, String.format("update project's labels"));
        activityLogRepository.save(activityLog);

        return ModelMapperUtil.mapList(savedLabels, LabelResponseDto.class);
    }


    @Override
    public List<Long> delete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        Label currentLabel = labelRepository.findById(id)
                .filter(l -> isAdmin || l.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Label", "id", id));

        Project project = Optional.of(currentLabel.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", currentLabel.getProject().getId()));

        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = checkManageLabel(currentUser, project, workSpace);

        List<Long> taskIds = currentLabel.getTasks().stream()
                .map(Task::getId)
                .collect(Collectors.toList());

        currentLabel.getTasks().forEach(task -> task.getLabels().remove(currentLabel));
        labelRepository.delete(currentLabel);

        return taskIds;
    }


    @Override
    public Boolean softDelete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Label currentLabel = labelRepository.findById(id)
                .filter(l -> isAdmin || l.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Label", "id", id));
        Project project =  Optional.of(currentLabel.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", currentLabel.getProject().getId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = checkManageLabel(currentUser, project, workSpace);
        Timestamp currentDatetime = timeUtil.getCurrentUTCTimestamp();
        currentLabel.setDeletedAt(currentDatetime);
        labelRepository.save(currentLabel);
        return true;
    }

    @Override
    public LabelResponseDto getOne(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Label currentLabel = labelRepository.findById(id)
                .filter(l -> isAdmin || l.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Label", "id", id));
        Project project =  Optional.of(currentLabel.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", currentLabel.getProject().getId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin) memberService.checkProjectAndWorkspaceBrowserPermission(currentUser, project, null);

        return ModelMapperUtil.mapOne(currentLabel, LabelResponseDto.class);
    }

    @Override
    public PageResponse<LabelResponseDto> getPageByProject(SearchParamRequestDto searchParams, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Project project = projectRepository.findById(projectId)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin) currentMember = memberService.checkProjectAndWorkspaceBrowserPermission(currentUser, project, null);


        Pageable pageable = PageRequest.of(
                searchParams.getPageNum(),
                searchParams.getPageSize(),
                Sort.by(searchParams.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParams.getSortBy() != null ? searchParams.getSortBy() : "createdAt"));

        Specification<Label> projectSpecification = (Root<Label> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<Label, Project> projectJoin = root.join("project");
            return criteriaBuilder.equal(projectJoin.get("id"), project.getId());
        };

        Specification<Label> filterSpecification = specificationUtil.getSpecificationFromFilters(searchParams.getFilters());

        Specification<Label> specification = Specification.where(projectSpecification)
                .and(filterSpecification);

        Page<Label> page = labelRepository.findAll(specification, pageable);
        List<LabelResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), LabelResponseDto.class);
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

    private Member checkManageLabel (User currentUser, Project project, WorkSpace workspace) {
        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.MANAGE_LABEL),
                false
        );

        Member currentWorkspaceMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                workspace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.MODIFY_ALL_PROJECT),
                false
        );

        if (currentProjectMember != null) return currentProjectMember;
        else if (currentWorkspaceMember != null) return currentWorkspaceMember;
        else throw new CustomException("This user can not do this action");
    }

    private ActivityLog activityLogLabelTemplate(Project project, User user, String content) {
        ActivityLog activityLogTemplate = new ActivityLog();
        activityLogTemplate.setProject(project);
        activityLogTemplate.setUser(user);
        activityLogTemplate.setUserText(user.getFirstName() + " " + user.getLastName() + " ("+ user.getEmail() +")");
        activityLogTemplate.setSystemInitial(false);
        activityLogTemplate.setSystemRequired(false);
        activityLogTemplate.setType(ActivityLogType.PROJECT_HISTORY);
        activityLogTemplate.setContent(content);

        return activityLogTemplate;
    }
}
