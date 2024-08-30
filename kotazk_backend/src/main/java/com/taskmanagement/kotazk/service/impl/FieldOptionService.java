package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.fieldoption.FieldOptionRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.field.FieldResponseDto;
import com.taskmanagement.kotazk.payload.response.fieldoption.FieldOptionResponseDto;
import com.taskmanagement.kotazk.repository.IFieldOptionRepository;
import com.taskmanagement.kotazk.repository.IFieldRepository;
import com.taskmanagement.kotazk.repository.IProjectRepository;
import com.taskmanagement.kotazk.service.IFieldOptionService;
import com.taskmanagement.kotazk.service.IMemberService;
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
public class FieldOptionService implements IFieldOptionService {
    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private IFieldRepository fieldRepository;
    @Autowired
    private IFieldOptionRepository fieldOptionRepository;
    @Autowired
    private IMemberService memberService = new MemberService();
    @Autowired
    private final BasicSpecificationUtil<FieldOption> specificationUtil = new BasicSpecificationUtil<>();
    @Autowired
    private TimeUtil timeUtil;

    @Override
    public FieldOptionResponseDto create(FieldOptionRequestDto fieldOptionRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Field field = fieldRepository.findById(fieldOptionRequestDto.getFieldId())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", fieldOptionRequestDto.getFieldId()));
        Project project = Optional.of(field.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", field.getProject().getId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin) currentMember = checkManageFieldPermission(currentUser, project, workSpace);

        if (field.getType().equals(FieldType.SELECT)
                && fieldOptionRequestDto.getIsDefaultValue() != null
                && fieldOptionRequestDto.getIsDefaultValue()) {
            FieldOption fieldOptionHasDefaultValue = field.getFieldOptions().stream()
                    .filter(FieldOption::getIsDefaultValue)
                    .findFirst()
                    .orElseThrow(() -> new CustomException("Something wrong happened!"));

            fieldOptionHasDefaultValue.setIsDefaultValue(false);
            fieldOptionRepository.save(fieldOptionHasDefaultValue);
        }

        FieldOption newFieldOption = FieldOption.builder()
                .value(fieldOptionRequestDto.getValue())
                .description(fieldOptionRequestDto.getDescription())
                .position(RepositionUtil.calculateNewLastPosition(field.getFieldOptions().size()))
                .isDefaultValue(fieldOptionRequestDto.getIsDefaultValue())
                .field(field)
                .build();

        FieldOption savedFieldOption = fieldOptionRepository.save(newFieldOption);

        return ModelMapperUtil.mapOne(savedFieldOption, FieldOptionResponseDto.class);
    }

    @Override
    public FieldOptionResponseDto update(Long id, FieldOptionRequestDto fieldOptionRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        FieldOption currentFieldOption = fieldOptionRepository.findById(id)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        Field field = fieldRepository.findById(fieldOptionRequestDto.getFieldId())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", fieldOptionRequestDto.getFieldId()));
        Project project = Optional.of(field.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", field.getProject().getId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin) currentMember = checkManageFieldPermission(currentUser, project, workSpace);

        if (field.getType().equals(FieldType.SELECT)
                && fieldOptionRequestDto.getIsDefaultValue() != null
                && fieldOptionRequestDto.getIsDefaultValue()) {
            FieldOption fieldOptionHasDefaultValue = field.getFieldOptions().stream()
                    .filter(FieldOption::getIsDefaultValue)
                    .findFirst()
                    .orElseThrow(() -> new CustomException("Something wrong happened!"));

            fieldOptionHasDefaultValue.setIsDefaultValue(false);
            fieldOptionRepository.save(fieldOptionHasDefaultValue);
        }

        Optional.ofNullable(fieldOptionRequestDto.getValue()).ifPresent(currentFieldOption::setValue);
        Optional.ofNullable(fieldOptionRequestDto.getDescription()).ifPresent(currentFieldOption::setDescription);
        Optional.ofNullable(fieldOptionRequestDto.getIsDefaultValue()).ifPresent(currentFieldOption::setIsDefaultValue);

        FieldOption savedFieldOption = fieldOptionRepository.save(currentFieldOption);

        return ModelMapperUtil.mapOne(savedFieldOption, FieldOptionResponseDto.class);
    }

    @Override
    public Boolean delete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        FieldOption currentFieldOption = fieldOptionRepository.findById(id)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        Field field =  Optional.of(currentFieldOption.getField())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", currentFieldOption.getField().getId()));
        Project project = Optional.of(field.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", field.getProject().getId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin) currentMember = checkManageFieldPermission(currentUser, project, workSpace);

        fieldOptionRepository.delete(currentFieldOption);
        return true;
    }

    @Override
    public Boolean softDelete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        FieldOption currentFieldOption = fieldOptionRepository.findById(id)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        Field field =  Optional.of(currentFieldOption.getField())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", currentFieldOption.getField().getId()));
        Project project = Optional.of(field.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", field.getProject().getId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin) currentMember = checkManageFieldPermission(currentUser, project, workSpace);

        Timestamp currentDatetime = timeUtil.getCurrentUTCTimestamp();

        currentFieldOption.setDeletedAt(currentDatetime);
        fieldOptionRepository.delete(currentFieldOption);
        return true;
    }

    @Override
    public FieldOptionResponseDto getOne(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        FieldOption currentFieldOption = fieldOptionRepository.findById(id)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        Field field =  Optional.of(currentFieldOption.getField())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", currentFieldOption.getField().getId()));
        Project project = Optional.of(field.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", field.getProject().getId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin)
            currentMember = memberService.checkProjectAndWorkspaceBrowserPermission(currentUser, project, null);

        return ModelMapperUtil.mapOne(currentFieldOption, FieldOptionResponseDto.class);
    }

    @Override
    public PageResponse<FieldOptionResponseDto> getPageByProject(SearchParamRequestDto searchParams, Long fieldId) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Field field =  fieldRepository.findById(fieldId)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Field", "id", fieldId));
        Project project = Optional.of(field.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", field.getProject().getId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin)
            currentMember = memberService.checkProjectAndWorkspaceBrowserPermission(currentUser, project, null);

        Pageable pageable = PageRequest.of(
                searchParams.getPageNum(),
                searchParams.getPageSize(),
                Sort.by(searchParams.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParams.getSortBy() != null ? searchParams.getSortBy() : "createdAt"));

        Specification<FieldOption> projectSpecification = (Root<FieldOption> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<FieldOption, Field> fieldJoin = root.join("filed");
            return criteriaBuilder.equal(fieldJoin.get("id"), field.getId());
        };

        Specification<FieldOption> filterSpecification = specificationUtil.getSpecificationFromFilters(searchParams.getFilters());

        Specification<FieldOption> specification = Specification.where(projectSpecification)
                .and(filterSpecification);

        Page<FieldOption> page = fieldOptionRepository.findAll(specification, pageable);
        List<FieldOptionResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), FieldOptionResponseDto.class);
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

    private Member checkManageFieldPermission(User currentUser, Project project, WorkSpace workspace) {
        Member currentProjectMember = memberService.checkProjectMember(
                currentUser.getId(),
                project.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(ProjectPermission.MANAGE_FIELD),
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
