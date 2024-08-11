package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.EntityBelongsTo;
import com.taskmanagement.kotazk.entity.enums.MemberStatus;
import com.taskmanagement.kotazk.entity.enums.Role;
import com.taskmanagement.kotazk.entity.enums.WorkSpacePermission;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.FilterCriteriaRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.member.MemberRequestDto;
import com.taskmanagement.kotazk.payload.request.memberrole.MemberRoleRequestDto;
import com.taskmanagement.kotazk.payload.request.workspace.WorkSpaceRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceDetailResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceSummaryResponseDto;
import com.taskmanagement.kotazk.repository.ICustomizationRepository;
import com.taskmanagement.kotazk.repository.IMemberRepository;
import com.taskmanagement.kotazk.repository.IWorkSpaceRepository;
import com.taskmanagement.kotazk.service.IMemberRoleService;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.IWorkSpaceService;
import com.taskmanagement.kotazk.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.management.relation.RoleStatus;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class WorkSpaceService implements IWorkSpaceService {
    @Autowired
    private IWorkSpaceRepository workSpaceRepository;
    @Autowired
    private IMemberService memberService = new MemberService();
    @Autowired
    private IMemberRoleService memberRoleService = new MemberRoleService();
    @Autowired
    private ICustomizationRepository customizationRepository;
    @Autowired
    private TimeUtil timeUtil;
    @Autowired
    private final BasicSpecificationUtil<WorkSpace> specificationUtil = new BasicSpecificationUtil<>();

    @Override
    public WorkSpaceDetailResponseDto initialWorkSpace(WorkSpaceRequestDto workSpace) {
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace newWorkSpace = create(workSpace);
        List<MemberRole> memberRoles = memberRoleService.initialMemberRole(newWorkSpace.getId(), null);
        Optional<MemberRole> memberRole = memberRoles.stream()
                .filter(item -> Objects.equals(item.getName(), "Admin"))
                .findFirst();
        MemberRequestDto memberRequest = MemberRequestDto.builder()
                .workSpaceId(newWorkSpace.getId())
                .systemInitial(true)
                .systemRequired(true)
                .memberRoleId(memberRole.get().getId())
                .memberFor(EntityBelongsTo.WORK_SPACE)
                .userId(currentUser.getId())
                .status(MemberStatus.ACTIVE)
                .build();
        memberService.create(memberRequest, true);
        return ModelMapperUtil.mapOne(newWorkSpace, WorkSpaceDetailResponseDto.class);
    }

    @Override
    public WorkSpace create(WorkSpaceRequestDto workSpace) {
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace newWorkSpace = ModelMapperUtil.mapOne(workSpace, WorkSpace.class);
        newWorkSpace.setId(null);
        newWorkSpace.setUser(currentUser);
        if(workSpace.getCustomization() != null) {
            Customization customization = Customization.builder()
                    .avatar(workSpace.getCustomization().getAvatar())
                    .backgroundColor(workSpace.getCustomization().getBackgroundColor())
                    .fontColor(workSpace.getCustomization().getFontColor())
                    .icon(workSpace.getCustomization().getIcon())
                    .build();

            Customization savedCustomization = customizationRepository.save(customization);
            newWorkSpace.setCustomization(savedCustomization);
        } else newWorkSpace.setCustomization(null);

        String key = null;
        do {
            key = RandomStringGeneratorUtil.generateKey();
        } while (workSpaceRepository.findByKey(key).isPresent());
        newWorkSpace.setKey(key);

        // Lưu WorkSpace vào database
        WorkSpace savedWorkspace = workSpaceRepository.save(newWorkSpace);

        return savedWorkspace;
    }

    @Override
    public WorkSpaceDetailResponseDto update(Long id, WorkSpaceRequestDto workSpace) {
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace currentWorkSpace = workSpaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", id));

        // WORKSPACE_PERMISSION: MODIFY_OWN_PROJECT (check id), MODIFY_ALL_PROJECT,

        // PROJECT_PERMISSION: PROJECT_SETTING

        // Find new way to verify member permission of this work space or project

        Member currentMember = memberService.checkMemberStatus(currentUser.getId(), currentWorkSpace.getId(), null, MemberStatus.ACTIVE);

        if (!currentUser.getId().equals(currentWorkSpace.getUser().getId()))
            throw new CustomException("User can not modify this work space!");

        if (workSpace.getName() != null) currentWorkSpace.setName(workSpace.getName());
        if (workSpace.getDescription() != null) currentWorkSpace.setDescription(workSpace.getDescription());
        if (workSpace.getVisibility() != null) currentWorkSpace.setVisibility(workSpace.getVisibility());
        if (workSpace.getStatus() != null) currentWorkSpace.setStatus(workSpace.getStatus());

        if (workSpace.getCustomization() != null) {
            if (workSpace.getCustomization().getAvatar() != null)
                currentWorkSpace.getCustomization().setAvatar(workSpace.getCustomization().getAvatar());
            if (workSpace.getCustomization().getBackgroundColor() != null)
                currentWorkSpace.getCustomization().setBackgroundColor(workSpace.getCustomization().getBackgroundColor());
            if (workSpace.getCustomization().getFontColor() != null)
                currentWorkSpace.getCustomization().setFontColor(workSpace.getCustomization().getFontColor());
            if (workSpace.getCustomization().getIcon() != null)
                currentWorkSpace.getCustomization().setIcon(workSpace.getCustomization().getIcon());
        }

        workSpaceRepository.save(currentWorkSpace);

        return ModelMapperUtil.mapOne(currentWorkSpace, WorkSpaceDetailResponseDto.class);
    }

    @Override
    public Boolean delete(Long id) {
        WorkSpace currentWorkSpace = workSpaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        Member currentMember = memberService.checkMemberStatusAndPermission(currentUser.getId(),
                currentWorkSpace.getId(),
                null,
                MemberStatus.ACTIVE,
                String.valueOf(WorkSpacePermission.WORKSPACE_SETTING)
        );


        if (!currentUser.getId().equals(currentWorkSpace.getUser().getId()))
            throw new CustomException("User can not delete this work space!");

        workSpaceRepository.deleteById(currentWorkSpace.getId());
        return true;
    }

    @Override
    public Boolean softDelete(Long id) throws IOException, InterruptedException {
        WorkSpace currentWorkSpace = workSpaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        Member currentMember = memberService.checkMemberStatusAndPermission(currentUser.getId(),
                currentWorkSpace.getId(),
                null,
                MemberStatus.ACTIVE,
                String.valueOf(WorkSpacePermission.WORKSPACE_SETTING)
        );
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        if (!currentUser.getId().equals(currentWorkSpace.getUser().getId()))
            throw new CustomException("User can not delete this work space!");

        currentWorkSpace.setDeletedAt(currentTime);
        workSpaceRepository.save(currentWorkSpace);
        return true;
    }

    @Override
    public Boolean archive(Long id) throws IOException, InterruptedException {

        WorkSpace currentWorkSpace = workSpaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();
        Member currentMember = memberService.checkMemberStatusAndPermission(currentUser.getId(),
                currentWorkSpace.getId(),
                null,
                MemberStatus.ACTIVE,
                String.valueOf(WorkSpacePermission.WORKSPACE_SETTING)
        );

        if (!currentUser.getId().equals(currentWorkSpace.getUser().getId()))
            throw new CustomException("User can not archive this work space!");

        currentWorkSpace.setArchivedAt(currentTime);

        workSpaceRepository.save(currentWorkSpace);
        return true;
    }

    @Override
    public Boolean restore(Long id) {

        WorkSpace currentWorkSpace = workSpaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        Member currentMember = memberService.checkMemberStatusAndPermission(currentUser.getId(),
                currentWorkSpace.getId(),
                null,
                MemberStatus.ACTIVE,
                String.valueOf(WorkSpacePermission.WORKSPACE_SETTING)
        );

        if (!currentUser.getId().equals(currentWorkSpace.getUser().getId()))
            throw new CustomException("User can not archive this work space!");

        currentWorkSpace.setArchivedAt(null);

        workSpaceRepository.save(currentWorkSpace);
        return true;
    }

    @Override
    public WorkSpaceDetailResponseDto getDetail(Long id) {
//        WorkSpace currentWorkSpace = workSpaceRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", id));
//        User currentUser = SecurityUtil.getCurrentUser();
//        Long userId = currentUser.getId();
//        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);
//
//        Specification<WorkSpace> specification = Specification
//                .where(WorkSpaceSpecification.isOwnerOrMember(userId, isAdmin));
//


        return null;
    }

    @Override
    public WorkSpaceSummaryResponseDto getSummary(Long id) {
        return null;
    }

    @Override
    public PageResponse<WorkSpaceSummaryResponseDto> getSummaryList(SearchParamRequestDto searchParam) {
        User currentUser = SecurityUtil.getCurrentUser();
        Long userId = currentUser.getId();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "createdAt"));

        Specification<WorkSpace> specification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Page<WorkSpace> page = workSpaceRepository.findAll(specification, pageable);
        List<WorkSpaceSummaryResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), WorkSpaceSummaryResponseDto.class);
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
    public PageResponse<WorkSpaceDetailResponseDto> getDetailList(SearchParamRequestDto searchParam) {
        User currentUser = SecurityUtil.getCurrentUser();
        Long userId = currentUser.getId();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "created_at"));

        Specification<WorkSpace> specification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Page<WorkSpace> page = workSpaceRepository.findAll(specification, pageable);
        List<WorkSpaceDetailResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), WorkSpaceDetailResponseDto.class);
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
}
