package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.MemberStatus;
import com.taskmanagement.kotazk.entity.enums.ProjectPermission;
import com.taskmanagement.kotazk.entity.enums.Role;
import com.taskmanagement.kotazk.entity.enums.SectionType;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.section.SectionRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.section.SectionResponseDto;
import com.taskmanagement.kotazk.payload.response.task.TaskResponseDto;
import com.taskmanagement.kotazk.repository.IProjectRepository;
import com.taskmanagement.kotazk.repository.ISectionRepository;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.ISectionService;
import com.taskmanagement.kotazk.util.BasicSpecificationUtil;
import com.taskmanagement.kotazk.util.ModelMapperUtil;
import com.taskmanagement.kotazk.util.RepositionUtil;
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

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class SectionService implements ISectionService {
    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private ISectionRepository sectionRepository;
    @Autowired
    private IMemberService memberService = new MemberService();
    @Autowired
    private final BasicSpecificationUtil<Section> specificationUtil = new BasicSpecificationUtil<>();

    @Override
    public List<Section> initialSection() {
        return List.of(
                createDefaultInitialSection("To do", RepositionUtil.calculateNewLastPosition(0), SectionType.KANBAN)
        );
    }

    @Override
    public SectionResponseDto create(SectionRequestDto sectionRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        Project project = projectRepository.findById(sectionRequestDto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", sectionRequestDto.getProjectId()));
        Member currentMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.MANAGE_SECTION),
                true
        );

        WorkSpace workSpace = project.getWorkSpace();

        Section newSection = Section.builder()
                .name(sectionRequestDto.getName())
                .project(project)
                .position((long) project.getSections().size())
                .type(sectionRequestDto.getType())
                .build();

        Section savedSection = sectionRepository.save(newSection);

        return ModelMapperUtil.mapOne(savedSection, SectionResponseDto.class);
    }

    @Override
    public SectionResponseDto update(Long id, SectionRequestDto sectionRequestDto) {
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
    public SectionResponseDto getOne(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        Section currentSection = sectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Section", "id", id));
        Project project = currentSection.getProject();
        Member currentMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.BROWSE_PROJECT),
                true
        );

        return ModelMapperUtil.mapOne(currentSection, SectionResponseDto.class);
    }

    @Override
    public PageResponse<SectionResponseDto> getPageByProject(SearchParamRequestDto searchParam, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Long userId = currentUser.getId();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        Member currentMember = null;

        if (!isAdmin)
            currentMember = memberService.checkProjectMember(
                    currentUser.getId(),
                    project.getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(ProjectPermission.BROWSE_PROJECT),
                    true
            );

        Specification<Section> projectSpecification = (Root<Section> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<Section, Project> projectJoin = root.join("project");
            return criteriaBuilder.equal(projectJoin.get("id"), project.getId());
        };

        Specification<Section> filterSpecification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "createdAt"));

        Specification<Section> specification = Specification.where(projectSpecification)
                .and(filterSpecification);

        Page<Section> page = sectionRepository.findAll(specification, pageable);
        List<SectionResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), SectionResponseDto.class);

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

    private Section createDefaultInitialSection(String name, Long position, SectionType type) {
        return Section.builder()
                .name(name)
                .description("")
                .position(position)
                .systemInitial(true)
                .systemRequired(true)
                .type(type)
                .build();
    }
}
