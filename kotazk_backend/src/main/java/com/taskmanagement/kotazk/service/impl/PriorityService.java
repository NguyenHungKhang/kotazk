package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.priority.PriorityRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.priority.PriorityResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusSummaryResponseDto;
import com.taskmanagement.kotazk.repository.IPriorityRepository;
import com.taskmanagement.kotazk.repository.IProjectRepository;
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
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PriorityService implements IPriorityService {
    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private IPriorityRepository priorityRepository;
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

        Optional.ofNullable(priorityRequestDto.getName()).ifPresent(currentPriority::setName);
        Optional.ofNullable(priorityRequestDto.getCustomization()).ifPresent(customization -> {
            Optional.ofNullable(customization.getAvatar()).ifPresent(priorityRequestDto.getCustomization()::setAvatar);
            Optional.ofNullable(customization.getBackgroundColor()).ifPresent(priorityRequestDto.getCustomization()::setBackgroundColor);
            Optional.ofNullable(customization.getFontColor()).ifPresent(priorityRequestDto.getCustomization()::setFontColor);
            Optional.ofNullable(customization.getIcon()).ifPresent(priorityRequestDto.getCustomization()::setIcon);
        });

        Priority savedPriority = priorityRepository.save(currentPriority);

        return ModelMapperUtil.mapOne(savedPriority, PriorityResponseDto.class);
    }

    @Override
    public Boolean delete(Long id) {
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

        priorityRepository.delete(currentPriority);

        return true;
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

        Member currentMember = checkManagePriority(currentUser, project, workSpace);

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
        if (!isAdmin) memberService.checkProjectBrowserPermission(currentUser, project, null);

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
        if (!isAdmin) currentMember = memberService.checkProjectBrowserPermission(currentUser, project, null);


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
}
