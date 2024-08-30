package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.field.FieldRequestDto;
import com.taskmanagement.kotazk.payload.request.fieldoption.FieldOptionRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.field.FieldResponseDto;
import com.taskmanagement.kotazk.payload.response.label.LabelResponseDto;
import com.taskmanagement.kotazk.repository.IFieldRepository;
import com.taskmanagement.kotazk.repository.ILabelRepository;
import com.taskmanagement.kotazk.repository.IProjectRepository;
import com.taskmanagement.kotazk.service.IFieldService;
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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@Transactional
public class FieldService implements IFieldService {
    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private IFieldRepository fieldRepository;
    @Autowired
    private IMemberService memberService = new MemberService();
    @Autowired
    private final BasicSpecificationUtil<Field> specificationUtil = new BasicSpecificationUtil<>();
    @Autowired
    private TimeUtil timeUtil;

    @Override
    public FieldResponseDto create(FieldRequestDto fieldRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Project project = projectRepository.findById(fieldRequestDto.getProjectId())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", fieldRequestDto.getProjectId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin) currentMember = checkManageFieldPermission(currentUser, project, workSpace);

        boolean isMultipleChoice = false;
        if (fieldRequestDto.getType().equals(FieldType.SELECT)
                || fieldRequestDto.getType().equals(FieldType.CHECKBOX))
            isMultipleChoice = true;

        List<FieldOption> fieldOptions = checkTaskTypeAndDefaultValue(fieldRequestDto);

        Field newField = Field.builder()
                .name(fieldRequestDto.getName())
                .type(fieldRequestDto.getType())
                .description(fieldRequestDto.getDescription())
                .isRequired(fieldRequestDto.getIsRequired())
                .isMultipleChoice(isMultipleChoice)
                .isHideWhenEmpty(fieldRequestDto.getIsHideWhenEmpty())
                .position(RepositionUtil.calculateNewLastPosition(project.getTasks().size()))
                .fieldOptions(fieldOptions)
                .build();

        fieldOptions.forEach(fo -> fo.setField(newField));

        Field savedField = fieldRepository.save(newField);

        return ModelMapperUtil.mapOne(savedField, FieldResponseDto.class);
    }

    @Override
    public FieldResponseDto update(Long id, FieldRequestDto fieldRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Field currentField = fieldRepository.findById(id)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Field", "id", id));
        Project project =  Optional.of(currentField.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", currentField.getProject().getId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin)
            currentMember = memberService.checkProjectAndWorkspaceBrowserPermission(currentUser, project, null);

        Optional.ofNullable(fieldRequestDto.getName()).ifPresent(currentField::setName);
        Optional.ofNullable(fieldRequestDto.getDescription()).ifPresent(currentField::setDescription);
        Optional.ofNullable(fieldRequestDto.getDefaultValue()).ifPresent(currentField::setDefaultValue);
        Optional.ofNullable(fieldRequestDto.getIsHideWhenEmpty()).ifPresent(currentField::setIsHideWhenEmpty);
        Optional.ofNullable(fieldRequestDto.getIsRequired()).ifPresent(currentField::setIsRequired);

        Field savedField = fieldRepository.save(currentField);

        return ModelMapperUtil.mapOne(savedField, FieldResponseDto.class);
    }

    @Override
    public Boolean delete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Field currentField = fieldRepository.findById(id)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Field", "id", id));
        Project project =  Optional.of(currentField.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", currentField.getProject().getId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin)
            currentMember = memberService.checkProjectAndWorkspaceBrowserPermission(currentUser, project, null);

        fieldRepository.delete(currentField);

        return true;
    }

    @Override
    public Boolean softDelete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Field currentField = fieldRepository.findById(id)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Field", "id", id));
        Project project =  Optional.of(currentField.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", currentField.getProject().getId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin)
            currentMember = memberService.checkProjectAndWorkspaceBrowserPermission(currentUser, project, null);

        Timestamp currentDatetime = timeUtil.getCurrentUTCTimestamp();

        currentField.setDeletedAt(currentDatetime);
        fieldRepository.save(currentField);

        return true;
    }

    @Override
    public FieldResponseDto getOne(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Field currentField = fieldRepository.findById(id)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Field", "id", id));
        Project project =  Optional.of(currentField.getProject())
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", currentField.getProject().getId()));
        WorkSpace workSpace = Optional.of(project.getWorkSpace())
                .filter(ws -> isAdmin || ws.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", project.getWorkSpace().getId()));

        Member currentMember = null;
        if (!isAdmin)
            currentMember = memberService.checkProjectAndWorkspaceBrowserPermission(currentUser, project, null);

        return ModelMapperUtil.mapOne(currentField, FieldResponseDto.class);
    }

    @Override
    public PageResponse<FieldResponseDto> getPageByProject(SearchParamRequestDto searchParams, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
        Project project = projectRepository.findById(projectId)
                .filter(p -> isAdmin || p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
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

        Specification<Field> projectSpecification = (Root<Field> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<Field, Project> projectJoin = root.join("project");
            return criteriaBuilder.equal(projectJoin.get("id"), project.getId());
        };

        Specification<Field> filterSpecification = specificationUtil.getSpecificationFromFilters(searchParams.getFilters());

        Specification<Field> specification = Specification.where(projectSpecification)
                .and(filterSpecification);

        Page<Field> page = fieldRepository.findAll(specification, pageable);
        List<FieldResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), FieldResponseDto.class);
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

    private List<FieldOption> checkTaskTypeAndDefaultValue(FieldRequestDto fieldRequestDto) {
        List<FieldOption> fieldOptions = new ArrayList<>();

        switch (fieldRequestDto.getType()) {
            case TEXT, TEXT_AREA:
                // Với TEXT và TEXT_AREA, không cần fieldOptions nên set null
                fieldRequestDto.setFieldOptions(null);
                break;
            case NUMBER:
                // Kiểm tra định dạng của default value đối với NUMBER
                validateNumberDefaultValue(fieldRequestDto.getDefaultValue());
                fieldRequestDto.setFieldOptions(null);
                break;
            case DATE:
                // Kiểm tra định dạng của default value đối với DATE
                validateDateDefaultValue(fieldRequestDto.getDefaultValue());
                fieldRequestDto.setFieldOptions(null);
                break;
            case SELECT:
                fieldOptions = validateAndSetFieldOptionsForSelect(fieldRequestDto.getFieldOptions());
                break;
            case CHECKBOX:
                fieldOptions = validateAndSetFieldOptionsForCheckbox(fieldRequestDto.getFieldOptions());
                break;
            default:
                throw new CustomException("Invalid input!");
        }

        return fieldOptions;
    }

    // Hàm kiểm tra định dạng cho NUMBER
    private void validateNumberDefaultValue(String defaultValue) {
        Optional.ofNullable(defaultValue)
                .ifPresent(value -> {
                    try {
                        Double.parseDouble(value);
                    } catch (NumberFormatException e) {
                        throw new CustomException("Invalid number format!");
                    }
                });
    }

    // Hàm kiểm tra định dạng cho DATE
    private void validateDateDefaultValue(String defaultValue) {
        Optional.ofNullable(defaultValue)
                .ifPresent(value -> {
                    try {
                        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                        formatter.setLenient(false);
                        Timestamp timestamp = new Timestamp(formatter.parse(value).getTime());
                    } catch (ParseException e) {
                        throw new CustomException("Invalid timestamp format!");
                    }
                });
    }

    private List<FieldOption> validateAndSetFieldOptionsForSelect(List<FieldOptionRequestDto> fieldOptionRequestDtos) {
        List<FieldOption> fieldOptions = new ArrayList<>();
        if (fieldOptionRequestDtos == null || fieldOptionRequestDtos.isEmpty()) {
            throw new CustomException("Field options cannot be null or empty!");
        }

        boolean hasDefaultValue = false;

        for (int i = 0; i < fieldOptionRequestDtos.size(); i++) {
            FieldOptionRequestDto dto = fieldOptionRequestDtos.get(i);

            if (dto == null || dto.getValue() == null || dto.getValue().trim().isEmpty()) {
                throw new CustomException("Field option value cannot be null or empty!");
            }

            if (Boolean.TRUE.equals(dto.getIsDefaultValue())) {
                if (hasDefaultValue) {
                    throw new CustomException("Only one field option can be set as default!");
                }
                hasDefaultValue = true;
            }

            FieldOption fieldOption = FieldOption.builder()
                    .value(dto.getValue())
                    .description(dto.getDescription())
                    .isDefaultValue(dto.getIsDefaultValue())
                    .position(RepositionUtil.calculateNewLastPosition(i))
                    .systemInitial(false)
                    .systemRequired(false)
                    .build();

            fieldOptions.add(fieldOption);
        }

        return fieldOptions;
    }


    // Hàm kiểm tra và thiết lập fieldOptions cho SELECT và CHECKBOX
    private List<FieldOption> validateAndSetFieldOptionsForCheckbox(List<FieldOptionRequestDto> fieldOptionRequestDtos) {
        List<FieldOption> fieldOptions = new ArrayList<>();
        if (fieldOptionRequestDtos == null || fieldOptionRequestDtos.isEmpty()) {
            throw new CustomException("Field options cannot be null or empty!");
        }

        for (int i = 0; i < fieldOptionRequestDtos.size(); i++) {
            if (fieldOptionRequestDtos.get(i) == null ||
                    fieldOptionRequestDtos.get(i).getValue() == null ||
                    fieldOptionRequestDtos.get(i).getValue().trim().isEmpty()) {
                throw new CustomException("Field option value cannot be null or empty!");
            }

            FieldOption fieldOption = FieldOption.builder()
                    .value(fieldOptionRequestDtos.get(i).getValue())
                    .description(fieldOptionRequestDtos.get(i).getDescription())
                    .isDefaultValue(fieldOptionRequestDtos.get(i).getIsDefaultValue())
                    .position(RepositionUtil.calculateNewLastPosition(i))
                    .systemInitial(false)
                    .systemRequired(false)
                    .build();

            fieldOptions.add(fieldOption);

        }

        return fieldOptions;
    }

}
