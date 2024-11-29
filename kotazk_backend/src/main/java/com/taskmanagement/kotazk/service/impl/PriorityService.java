package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.RePositionRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.priority.PriorityRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.priority.PriorityResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusSummaryResponseDto;
import com.taskmanagement.kotazk.payload.response.tasktype.TaskTypeResponseDto;
import com.taskmanagement.kotazk.repository.IPriorityRepository;
import com.taskmanagement.kotazk.repository.IProjectRepository;
import com.taskmanagement.kotazk.repository.ITaskRepository;
import com.taskmanagement.kotazk.service.ICustomizationService;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.IPriorityService;
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
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static com.taskmanagement.kotazk.config.ConstantConfig.DEFAULT_POSITION_STEP;

@Service
@Transactional
public class PriorityService implements IPriorityService {
    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private IPriorityRepository priorityRepository;
    @Autowired
    private ITaskRepository taskRepository;
    @Autowired
    private ICustomizationService customizationService = new CustomizationService();
    @Autowired
    private IMemberService memberService = new MemberService();
    @Autowired
    private final BasicSpecificationUtil<Priority> specificationUtil = new BasicSpecificationUtil<>();
    @Autowired
    private TimeUtil timeUtil;

    @Override
    public List<Priority> initialPriority() {
//        Customization taskCustomization = new Customization();
//        taskCustomization.setIcon("IconAssembly");
//        taskCustomization.setBackgroundColor("#0d9af2");
//
//        Customization subtaskCustomization = new Customization();
//        subtaskCustomization.setIcon("IconSubtask");
//        subtaskCustomization.setBackgroundColor("#8a3df5");
//
//        Customization milestoneCustomization = new Customization();
//        milestoneCustomization.setIcon("IconAssemblyFilled");
//        milestoneCustomization.setBackgroundColor("#47ebcd");
        return List.of(
                createDefaultInitialPriority("High", RepositionUtil.calculateNewLastPosition(2)),
                createDefaultInitialPriority("Medium", RepositionUtil.calculateNewLastPosition(1)),
                createDefaultInitialPriority("Low", RepositionUtil.calculateNewLastPosition(0))
        );
    }

    @Override
    public PriorityResponseDto create(PriorityRequestDto priorityRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Project project = projectRepository.findById(priorityRequestDto.getProjectId())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", priorityRequestDto.getProjectId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = checkManagePriority(currentUser, project, workSpace);

        Customization customization = Optional.ofNullable(priorityRequestDto.getCustomization())
                .map(customizationService::createBuilder)
                .orElse(null);

        Priority newPriority = Priority.builder()
                .name(priorityRequestDto.getName())
                .project(project)
                .systemRequired(false)
                .systemInitial(false)
                .customization(customization)
                .position(RepositionUtil.calculateNewLastPosition(project.getPriorities().size()))
                .build();

        Priority savedPriority = priorityRepository.save(newPriority);

        return ModelMapperUtil.mapOne(savedPriority, PriorityResponseDto.class);
    }

    @Override
    public PriorityResponseDto update(Long id, PriorityRequestDto priorityRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Priority currentPriority = priorityRepository.findById(id)
                .filter(pr -> isAdmin || pr.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Priority", "id", id));
        Project project = Optional.of(currentPriority.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", currentPriority.getProject().getId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = checkManagePriority(currentUser, project, workSpace);

        Optional.ofNullable(priorityRequestDto.getCustomization()).ifPresent(statusCustomization -> {
            Customization customization = Optional.ofNullable(currentPriority.getCustomization())
                    .orElseGet(() -> {
                        Customization newCustomization = new Customization();
                        currentPriority.setCustomization(newCustomization);
                        return newCustomization;
                    });

            Optional.ofNullable(statusCustomization.getBackgroundColor())
                    .ifPresent(customization::setBackgroundColor);
        });

        Optional.ofNullable(priorityRequestDto.getName()).ifPresent(currentPriority::setName);
        Optional.ofNullable(priorityRequestDto.getRePositionReq())
                .ifPresent(rePositionReq -> {
                    Long newPosition = calculateNewPositionForPriority(rePositionReq, project, currentPriority);
                    currentPriority.setPosition(newPosition);
                });

        Priority savedPriority = priorityRepository.save(currentPriority);

        return ModelMapperUtil.mapOne(savedPriority, PriorityResponseDto.class);
    }

    @Override
    public List<PriorityResponseDto> saveList(List<PriorityRequestDto> priorityRequestDtos, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Project project = projectRepository.findById(projectId)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        WorkSpace workSpace = project.getWorkSpace();

        Member currentMember = null;

        if (!isAdmin)
            currentMember = checkManagePriority(currentUser, project, workSpace);

        AtomicInteger positionIndex = new AtomicInteger();
        Set<Long> incomingPriorityIds = new HashSet<>();

        List<Priority> priorities = priorityRequestDtos.stream()
                .map(p -> {
                    Priority priority = new Priority();
                    Optional.ofNullable(p.getId()).ifPresent(id -> {
                        priority.setId(id);
                        incomingPriorityIds.add(id);
                    });
                    if (p.getProjectId() != projectId)
                        throw new CustomException("Invalid input!");
                    priority.setProject(project);
                    priority.setName(p.getName());
                    priority.setPosition(RepositionUtil.calculateNewLastPosition(positionIndex.getAndIncrement()));

                    Customization customization = new Customization();
                    customization.setBackgroundColor(p.getCustomization().getBackgroundColor());
                    customization.setIcon(p.getCustomization().getIcon());
                    priority.setCustomization(customization);

                    return priority;
                }).toList();

        List<Priority> deletedPriorities = project.getPriorities().stream()
                .filter(tt -> {
                    if (!incomingPriorityIds.contains(tt.getId()) && tt.getSystemRequired()) {
                        throw new CustomException("Cannot delete system priority");
                    }
                    return !incomingPriorityIds.contains(tt.getId());
                })
                .toList();

        List<String> idTaskTypesToDelete = deletedPriorities.stream().map(p -> p.getId().toString()).toList();

        project.getSections().forEach(section -> {
            section.getFilterSettings().forEach(filter -> {
                if (filter.getField().equals(FilterField.TASK_TYPE)) {
                    List<String> updatedValues = filter.getValues().stream()
                            .filter(value -> !idTaskTypesToDelete.contains(value))
                            .collect(Collectors.toList());
                    FilterSetting updatedFilter = FilterSetting.builder()
                            .section(section)
                            .field(filter.getField())
                            .values(updatedValues)
                            .operator(filter.getOperator())
                            .build();

                    section.getFilterSettings().remove(filter);
                    section.getFilterSettings().add(updatedFilter);
                }
            });
        });

        project.getPriorities().clear();
        project.getPriorities().addAll(priorities);
        List<Priority> savedPriorities = projectRepository.save(project).getPriorities();
        return ModelMapperUtil.mapList(savedPriorities, PriorityResponseDto.class);
    }

    @Override
    public List<Long> delete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        // Find the priority to delete
        Priority currentPriority = priorityRepository.findById(id)
                .filter(pr -> isAdmin || pr.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Priority", "id", id));

        // Check the associated project
        Project project = Optional.of(currentPriority.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", currentPriority.getProject().getId()));

        // Check the associated workspace
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        // Check user permissions (non-admin users)
        if (!isAdmin) {
            checkManagePriority(currentUser, project, workSpace);
        }

        // Prevent deletion of system-required priorities
        if (currentPriority.getSystemRequired()) {
            throw new CustomException("Cannot delete this priority");
        }

        // Collect task IDs associated with the priority
        List<Long> taskIds = currentPriority.getTasks().stream()
                .map(Task::getId)
                .collect(Collectors.toList());

        // Detach the priority from all tasks before deletion (set priority to null)
        currentPriority.getTasks().forEach(task -> task.setPriority(null));

        // Save all tasks in a batch and flush the changes
        taskRepository.saveAll(currentPriority.getTasks());
        taskRepository.flush();

        // Now it's safe to delete the priority
        priorityRepository.delete(currentPriority);
        priorityRepository.flush();

        // Return the task IDs
        return taskIds;
    }



    @Override
    public Boolean softDelete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Priority currentPriority = priorityRepository.findById(id)
                .filter(pr -> isAdmin || pr.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Priority", "id", id));
        Project project = Optional.of(currentPriority.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", currentPriority.getProject().getId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin) currentMember = checkManagePriority(currentUser, project, workSpace);

        if(currentPriority.getSystemRequired()) throw new CustomException("Can not delete this priority");

        Timestamp currentDatetime = timeUtil.getCurrentUTCTimestamp();
        currentPriority.setDeletedAt(currentDatetime);
        priorityRepository.save(currentPriority);
        return true;
    }

    @Override
    public PriorityResponseDto getOne(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Priority currentPriority = priorityRepository.findById(id)
                .filter(pr -> isAdmin || pr.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Priority", "id", id));
        Project project = Optional.of(currentPriority.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", currentPriority.getProject().getId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin) memberService.checkProjectAndWorkspaceBrowserPermission(currentUser, project, null);

        return ModelMapperUtil.mapOne(currentPriority, PriorityResponseDto.class);
    }

    @Override
    public PageResponse<PriorityResponseDto> getPageByProject(SearchParamRequestDto searchParam, Long projectId) {
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
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "createdAt"));

        Specification<Priority> projectSpecification = (Root<Priority> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<Priority, Project> projectJoin = root.join("project");
            return criteriaBuilder.equal(projectJoin.get("id"), project.getId());
        };

        Specification<Priority> filterSpecification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Specification<Priority> specification = Specification.where(projectSpecification)
                .and(filterSpecification);

        Page<Priority> page = priorityRepository.findAll(specification, pageable);
        List<PriorityResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), PriorityResponseDto.class);
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

    private Priority createDefaultInitialPriority(String name, Long position) {
        return Priority.builder()
                .name(name)
                .position(position)
                .systemInitial(true)
                .systemRequired(true)
                .build();
    }

    private Member checkManagePriority(User currentUser, Project project, WorkSpace workspace) {
        Member currentMember = null;
        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.MANAGE_PRIORITY),
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

    public Long calculateNewPositionForPriority(RePositionRequestDto rePositionReq, Project project, Priority currentPriority) {
        if (rePositionReq.getPreviousItemId() != null) {
            Long newPositionBaseOnPrevious = handlePreviousPriorityPosition(rePositionReq.getPreviousItemId(), currentPriority, project);
            if (newPositionBaseOnPrevious != null)
                return newPositionBaseOnPrevious;
        } else if (rePositionReq.getNextItemId() != null) {
            Long newPositionBaseOnNext = handleNextPriorityPosition(rePositionReq.getNextItemId(), currentPriority, project);
            if (newPositionBaseOnNext != null)
                return newPositionBaseOnNext;
        }

        throw new CustomException("Both previous and next positions cannot be null.");
    }

    private Long handlePreviousPriorityPosition(Long previousPriorityId, Priority currentPriority, Project project) {
        Optional<Priority> previousPriorityOpt = project.getPriorities().stream()
                .filter(priority -> priority.getId().equals(previousPriorityId))
                .findFirst();

        if (previousPriorityOpt.isEmpty()) {
            return null;
        }

        long previousPriorityPosition = previousPriorityOpt.get().getPosition();

        Long nextPriorityPosition = project.getPriorities().stream()
                .map(Priority::getPosition)
                .filter(position -> position > previousPriorityPosition)
                .min(Long::compare)
                .orElse(roundDownToSignificant(previousPriorityPosition + DEFAULT_POSITION_STEP));

        if (nextPriorityPosition - previousPriorityPosition <= 1) {
            repositionAllPriorities(project); // This will reorder priorities

            long updatedPreviousPriorityPosition = project.getPriorities().stream()
                    .filter(priority -> priority.getId().equals(previousPriorityId))
                    .map(Priority::getPosition)
                    .findFirst()
                    .orElse(0L);

            nextPriorityPosition = project.getPriorities().stream()
                    .map(Priority::getPosition)
                    .filter(position -> position > updatedPreviousPriorityPosition)
                    .min(Long::compare)
                    .orElse(roundDownToSignificant(updatedPreviousPriorityPosition + DEFAULT_POSITION_STEP));

            return (updatedPreviousPriorityPosition + nextPriorityPosition) / 2;
        }

        return (previousPriorityPosition + nextPriorityPosition) / 2;
    }

    // Function to round down to the nearest "significant" value, like 1,000,000 or 10,000
    private long roundDownToSignificant(long value) {
        if (value <= 0) return 0;
        int magnitude = (int) Math.log10(value);  // Get the number of digits - 1
        long factor = (long) Math.pow(10, magnitude); // Calculate the power of 10 based on magnitude
        return (value / factor) * factor; // Round down by removing less significant digits
    }

    private Long handleNextPriorityPosition(Long nextPriorityId, Priority currentPriority, Project project) {
        Optional<Priority> nextPriorityOpt = project.getPriorities().stream()
                .filter(priority -> priority.getId().equals(nextPriorityId))
                .findFirst();

        if (nextPriorityOpt.isEmpty()) {
            return null;
        }

        final Long nextPriorityPosition = nextPriorityOpt.get().getPosition();

        long previousPriorityPosition = project.getPriorities().stream()
                .map(Priority::getPosition)
                .filter(position -> position < nextPriorityPosition)
                .max(Long::compare)
                .orElse(0L);

        if (nextPriorityPosition - previousPriorityPosition <= 1) {
            repositionAllPriorities(project); // This will reorder priorities

            // After repositioning, refetch the previous and next priority positions
            final Long updatedNextPriorityPosition = project.getPriorities().stream()
                    .filter(priority -> priority.getId().equals(nextPriorityId)) // Fetch the new position of the previous priority by ID
                    .map(Priority::getPosition)
                    .findFirst()
                    .orElse(0L); // Default to 0 if no previous priority found

            previousPriorityPosition = project.getPriorities().stream()
                    .map(Priority::getPosition)
                    .filter(position -> position < updatedNextPriorityPosition)
                    .max(Long::compare)
                    .orElse(roundDownToSignificant(updatedNextPriorityPosition + DEFAULT_POSITION_STEP));

            return (updatedNextPriorityPosition + previousPriorityPosition) / 2;
        }

        return (previousPriorityPosition + nextPriorityPosition) / 2;
    }

    private void repositionAllPriorities(Project project) {
        List<Priority> orderedPriorities = project.getPriorities().stream()
                .sorted(Comparator.comparing(Priority::getPosition))
                .collect(Collectors.toList());

        for (int i = 0; i < orderedPriorities.size(); i++) {
            Priority priorityToReposition = orderedPriorities.get(i);
            priorityToReposition.setPosition(RepositionUtil.calculateNewLastPosition(i));
        }

        priorityRepository.saveAll(orderedPriorities);
    }

}
