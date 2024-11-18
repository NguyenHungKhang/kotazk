package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.filterSetting.FilterSettingRequestDto;
import com.taskmanagement.kotazk.payload.request.groupBySetting.GroupBySettingRequestDto;
import com.taskmanagement.kotazk.payload.request.section.SectionRequestDto;
import com.taskmanagement.kotazk.payload.request.sortSetting.SortSettingRequestDto;
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
                createDefaultInitialSection("Board", RepositionUtil.calculateNewLastPosition(0), SectionType.KANBAN)
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
                .position(RepositionUtil.calculateNewLastPosition(project.getSections().size()))
                .systemInitial(false)
                .systemRequired(false)
                .type(sectionRequestDto.getType())
                .build();

        Section savedSection = sectionRepository.save(newSection);

        return ModelMapperUtil.mapOne(savedSection, SectionResponseDto.class);
    }

    @Override
    public SectionResponseDto update(Long id, SectionRequestDto sectionRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Section", "id", id));
        Project project = section.getProject();
        WorkSpace workSpace = project.getWorkSpace();
        Member currentMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.MANAGE_SECTION),
                true
        );

        if (sectionRequestDto.getName() != null) section.setName(sectionRequestDto.getName());
        if (sectionRequestDto.getFilterSettings() != null) {
            section.getFilterSettings().clear();
            section.getFilterSettings().addAll(sectionRequestDto.getFilterSettings()
                    .stream()
                    .map(f -> {
                        checkFilter(f, project, section);
                        return FilterSetting.builder()
                                .section(section)
                                .field(f.getField())
                                .values(f.getValues())
                                .operator(f.getOperator())
                                .build();
                    }).toList());

        }
        if (sectionRequestDto.getGroupBySetting() != null) {
            checkGroupBy(sectionRequestDto.getGroupBySetting(), project, section);
            section.setGroupBySetting(GroupBySetting.builder()
                    .section(section)
                    .field(sectionRequestDto.getGroupBySetting().getField())
                    .build());
        } else section.setGroupBySetting(null);

        if (sectionRequestDto.getSortSetting() != null) {
            checkSort(sectionRequestDto.getSortSetting(), project, section);
            section.setSortSetting(SortSetting.builder()
                    .section(section)
                    .field(sectionRequestDto.getSortSetting().getField())
                    .asc(sectionRequestDto.getSortSetting().getAsc())
                    .build());
        } else section.setSortSetting(null);

        Section savedSection = sectionRepository.save(section);

        return ModelMapperUtil.mapOne(savedSection, SectionResponseDto.class);
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

    private Boolean checkFilter(FilterSettingRequestDto filterSettingRequestDto, Project project, Section section) {
        if (filterSettingRequestDto.getField().equals(FilterField.STATUS.getFieldName()))
            return project.getStatuses().stream().map(s -> s.getId()).toList().containsAll(filterSettingRequestDto.getValues().stream().map(v -> Long.parseLong(v)).toList());
        else if (filterSettingRequestDto.getField().equals(FilterField.PRIORITY.getFieldName()))
            return project.getPriorities().stream().map(p -> p.getId()).toList().containsAll(filterSettingRequestDto.getValues().stream().map(v -> Long.parseLong(v)).toList());
        else if (filterSettingRequestDto.getField().equals(FilterField.TASK_TYPE.getFieldName()))
            return project.getTaskTypes().stream().map(t -> t.getId()).toList().containsAll(filterSettingRequestDto.getValues().stream().map(v -> Long.parseLong(v)).toList());
        return false;
    }

    private Boolean checkGroupBy(GroupBySettingRequestDto groupBySettingRequestDto, Project project, Section section) {
        if (groupBySettingRequestDto.getField().equals(GroupByField.STATUS.getFieldName()))
            return true;
        else if (groupBySettingRequestDto.getField().equals(GroupByField.PRIORITY.getFieldName()))
            return true;
        else if (groupBySettingRequestDto.getField().equals(GroupByField.TASK_TYPE.getFieldName()))
            return true;
        return false;
    }

    private Boolean checkSort(SortSettingRequestDto sortSettingRequestDto, Project project, Section section) {
        if (sortSettingRequestDto.getField().equals(SortField.STATUS.getFieldName()))
            return true;
        else if (sortSettingRequestDto.getField().equals(SortField.PRIORITY.getFieldName()))
            return true;
        else if (sortSettingRequestDto.getField().equals(SortField.TASK_TYPE.getFieldName()))
            return true;
        return false;
    }
}
