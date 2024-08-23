package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.priority.PriorityResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusResponseDto;
import com.taskmanagement.kotazk.payload.response.status.StatusSummaryResponseDto;
import com.taskmanagement.kotazk.repository.IPriorityRepository;
import com.taskmanagement.kotazk.repository.IProjectRepository;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.IPriorityService;
import com.taskmanagement.kotazk.util.BasicSpecificationUtil;
import com.taskmanagement.kotazk.util.ModelMapperUtil;
import com.taskmanagement.kotazk.util.SecurityUtil;
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

import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class PriorityService implements IPriorityService {
    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private IPriorityRepository priorityRepository;
    @Autowired
    private IMemberService memberService = new MemberService();
    @Autowired
    private final BasicSpecificationUtil<Priority> specificationUtil = new BasicSpecificationUtil<>();

    @Override
    public List<Priority> initialPriority() {
        return List.of(
                createDefaultInitialPriority("High", 2L),
                createDefaultInitialPriority("Medium", 1L),
                createDefaultInitialPriority("Low", 0L)
        );
    }

    @Override
    public PriorityResponseDto getOne(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        Priority currentPriority = priorityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Priority", "id", id));
        if (currentPriority.getDeletedAt() != null) throw new ResourceNotFoundException("Status", "id", id);
        Project currentProject = currentPriority.getProject();
        WorkSpace currentWorkSpace = currentProject.getWorkSpace();

        Member currentWorkSpaceMember = null;

        if (currentProject.getVisibility().equals(Visibility.PRIVATE))
            currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                    currentUser.getId(),
                    currentWorkSpace.getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(WorkSpacePermission.BROWSE_PRIVATE_PROJECT),
                    false
            );
        else if (currentProject.getVisibility().equals(Visibility.PUBLIC))
            currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                    currentUser.getId(),
                    currentWorkSpace.getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(WorkSpacePermission.BROWSE_PUBLIC_PROJECT),
                    false
            );
        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                currentProject.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.BROWSE_PROJECT),
                false
        );

        if (currentProjectMember == null && currentWorkSpaceMember == null)
            throw new CustomException("This member's role is not permission with this action!");

        return ModelMapperUtil.mapOne(currentPriority, PriorityResponseDto.class);
    }

    @Override
    public PageResponse<PriorityResponseDto> getPageByProject(SearchParamRequestDto searchParam, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Project currentProject = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        WorkSpace currentWorkSpace = currentProject.getWorkSpace();

        if (currentUser.getRole().equals(Role.USER)) {
            Member currentWorkSpaceMember = null;

            if (currentProject.getVisibility().equals(Visibility.PRIVATE))
                currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                        currentUser.getId(),
                        currentWorkSpace.getId(),
                        Collections.singletonList(MemberStatus.ACTIVE),
                        Collections.singletonList(WorkSpacePermission.BROWSE_PRIVATE_PROJECT),
                        false
                );
            else if (currentProject.getVisibility().equals(Visibility.PUBLIC))
                currentWorkSpaceMember = memberService.checkWorkSpaceMember(
                        currentUser.getId(),
                        currentWorkSpace.getId(),
                        Collections.singletonList(MemberStatus.ACTIVE),
                        Collections.singletonList(WorkSpacePermission.BROWSE_PUBLIC_PROJECT),
                        false
                );
            Member currentProjectMember = memberService.checkProjectMember(
                    currentUser.getId(),
                    currentProject.getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(ProjectPermission.BROWSE_PROJECT),
                    false
            );
        }

        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "createdAt"));

        Specification<Priority> projectSpecification = (Root<Priority> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<Priority, Project> projectJoin = root.join("project");
            return criteriaBuilder.equal(projectJoin.get("id"), currentProject.getId());
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
}
