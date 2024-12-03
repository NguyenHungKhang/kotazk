package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.FilterCriteriaRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.member.MemberRequestDto;
import com.taskmanagement.kotazk.payload.request.memberrole.MemberRoleRequestDto;
import com.taskmanagement.kotazk.payload.request.workspace.WorkSpaceRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.project.ProjectResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceDetailResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceSummaryResponseDto;
import com.taskmanagement.kotazk.repository.ICustomizationRepository;
import com.taskmanagement.kotazk.repository.IMemberRepository;
import com.taskmanagement.kotazk.repository.IWorkSpaceRepository;
import com.taskmanagement.kotazk.service.ICustomizationService;
import com.taskmanagement.kotazk.service.IMemberRoleService;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.IWorkSpaceService;
import com.taskmanagement.kotazk.util.*;
import jakarta.persistence.criteria.*;
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
    private ICustomizationService customizationService = new CustomizationService();
    @Autowired
    private ICustomizationRepository customizationRepository;
    @Autowired
    private TimeUtil timeUtil;
    @Autowired
    private final BasicSpecificationUtil<WorkSpace> specificationUtil = new BasicSpecificationUtil<>();

    @Override
    public WorkSpaceDetailResponseDto initialWorkSpace(WorkSpaceRequestDto workSpaceDto) {
        User currentUser = SecurityUtil.getCurrentUser();

        Customization customization = null;
        if (workSpaceDto.getCustomization() != null) customization = customizationService.createBuilder(workSpaceDto.getCustomization());

        List<MemberRole> memberRoles = memberRoleService.initialMemberRole(true);
        Optional<MemberRole> memberRole = memberRoles.stream()
                .filter(item -> Objects.equals(item.getName(), "Admin"))
                .findFirst();

        Member member = Member.builder()
                .systemInitial(true)
                .systemRequired(true)
                .role(memberRole.get())
                .memberFor(EntityBelongsTo.WORK_SPACE)
                .user(currentUser)
                .status(MemberStatus.ACTIVE)
                .build();

        WorkSpace newWorkSpace = WorkSpace.builder()
                .name(workSpaceDto.getName())
                .user(currentUser)
                .description(workSpaceDto.getDescription())
                .status(WorkSpaceStatus.ACTIVE)
                .visibility(workSpaceDto.getVisibility())
                .key(generateUniqueKey())
                .customization(customization)
                .memberRoles(new HashSet<>(memberRoles))
                .members(Collections.singletonList(member))
                .build();

        memberRoles.forEach(role -> role.setWorkSpace(newWorkSpace));
        member.setWorkSpace(newWorkSpace);

        WorkSpace saveWorkSpace = workSpaceRepository.save(newWorkSpace);

        return ModelMapperUtil.mapOne(saveWorkSpace, WorkSpaceDetailResponseDto.class);
    }

//    @Override
//    public WorkSpace create(WorkSpaceRequestDto workSpace) {
//        User currentUser = SecurityUtil.getCurrentUser();
//        WorkSpace newWorkSpace = ModelMapperUtil.mapOne(workSpace, WorkSpace.class);
//        newWorkSpace.setId(null);
//        newWorkSpace.setUser(currentUser);
//        if (workSpace.getCustomization() != null) {
//            Customization customization = Customization.builder()
//                    .avatar(workSpace.getCustomization().getAvatar())
//                    .backgroundColor(workSpace.getCustomization().getBackgroundColor())
//                    .fontColor(workSpace.getCustomization().getFontColor())
//                    .icon(workSpace.getCustomization().getIcon())
//                    .build();
//
//            Customization savedCustomization = customizationRepository.save(customization);
//            newWorkSpace.setCustomization(savedCustomization);
//        } else newWorkSpace.setCustomization(null);
//
//        String key = null;
//        do {
//            key = RandomStringGeneratorUtil.generateKey();
//        } while (workSpaceRepository.findByKey(key).isPresent());
//        newWorkSpace.setKey(key);
//
//        return workSpaceRepository.save(newWorkSpace);
//    }

    @Override
    public WorkSpaceDetailResponseDto update(Long id, WorkSpaceRequestDto workSpace) {
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace currentWorkSpace = workSpaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", id));

        Member currentMember = checkWorkspaceSettingPermission(currentUser.getId(), currentWorkSpace.getId());

        Optional.ofNullable(workSpace.getName()).ifPresent(currentWorkSpace::setName);
        Optional.ofNullable(workSpace.getDescription()).ifPresent(currentWorkSpace::setDescription);
        Optional.ofNullable(workSpace.getVisibility()).ifPresent(currentWorkSpace::setVisibility);
        Optional.ofNullable(workSpace.getStatus()).ifPresent(currentWorkSpace::setStatus);

        Optional.ofNullable(workSpace.getCustomization()).ifPresent(customization -> {
            Optional.ofNullable(customization.getAvatar()).ifPresent(currentWorkSpace.getCustomization()::setAvatar);
            Optional.ofNullable(customization.getBackgroundColor()).ifPresent(currentWorkSpace.getCustomization()::setBackgroundColor);
            Optional.ofNullable(customization.getFontColor()).ifPresent(currentWorkSpace.getCustomization()::setFontColor);
            Optional.ofNullable(customization.getIcon()).ifPresent(currentWorkSpace.getCustomization()::setIcon);
        });

        WorkSpace savedWorkspace =  workSpaceRepository.save(currentWorkSpace);
        return ModelMapperUtil.mapOne(savedWorkspace, WorkSpaceDetailResponseDto.class);
    }

    @Override
    public Boolean delete(Long id) {
        WorkSpace currentWorkSpace = workSpaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        Member currentMember = memberService.checkWorkSpaceMember(currentUser.getId(),
                currentWorkSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.WORKSPACE_SETTING),
                true
        );


        workSpaceRepository.deleteById(currentWorkSpace.getId());
        return true;
    }

    @Override
    public Boolean softDelete(Long id) {
        WorkSpace currentWorkSpace = workSpaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        Member currentMember = memberService.checkWorkSpaceMember(currentUser.getId(),
                currentWorkSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.WORKSPACE_SETTING),
                true
        );
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        currentWorkSpace.setDeletedAt(currentTime);
        workSpaceRepository.save(currentWorkSpace);
        return true;
    }

    @Override
    public Boolean archive(Long id) {

        WorkSpace currentWorkSpace = workSpaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();
        Member currentMember = memberService.checkWorkSpaceMember(currentUser.getId(),
                currentWorkSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.WORKSPACE_SETTING),
                true
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
        Member currentMember = memberService.checkWorkSpaceMember(currentUser.getId(),
                currentWorkSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.WORKSPACE_SETTING),
                true
        );

        currentWorkSpace.setArchivedAt(null);

        workSpaceRepository.save(currentWorkSpace);
        return true;
    }

    @Override
    public WorkSpaceDetailResponseDto getDetail(Long id) {
        WorkSpace currentWorkSpace = workSpaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        Member currentMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                currentWorkSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.BROWSE_WORKSPACE),
                true
        );
        return ModelMapperUtil.mapOne(currentWorkSpace, WorkSpaceDetailResponseDto.class);
    }

    @Override
    public WorkSpaceSummaryResponseDto getSummary(Long id) {
        WorkSpace currentWorkSpace = workSpaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", id));
        User currentUser = SecurityUtil.getCurrentUser();
        Member currentMember = memberService.checkWorkSpaceMember(
                currentUser.getId(),
                currentWorkSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.BROWSE_WORKSPACE),
                true
        );
        return ModelMapperUtil.mapOne(currentWorkSpace, WorkSpaceSummaryResponseDto.class);
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

        Specification<WorkSpace> filterSpecification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());
        Specification<WorkSpace> specification = isAdmin ? filterSpecification :
                hasUserPermissions(userId, Collections.singletonList(WorkSpacePermission.BROWSE_WORKSPACE))
                        .and(filterSpecification);

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

        Specification<WorkSpace> filterSpecification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());
        Specification<WorkSpace> specification = isAdmin ? filterSpecification :
                hasUserPermissions(userId, Collections.singletonList(WorkSpacePermission.BROWSE_WORKSPACE))
                        .and(filterSpecification);

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

    // Utility method

    private Member checkWorkspaceSettingPermission(Long userId, Long workspaceId) {
        return memberService.checkWorkSpaceMember(
                userId,
                workspaceId,
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.BROWSE_WORKSPACE),
                true
        );
    }

    private String generateUniqueKey() {
        String key;
        do {
            key = RandomStringGeneratorUtil.generateKey();
        } while (workSpaceRepository.findByKey(key).isPresent());
        return key;
    }

    public static Specification<WorkSpace> hasUserPermissions(Long userId, List<WorkSpacePermission> permissions) {
        return (Root<WorkSpace> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<WorkSpace, Member> memberJoin = root.join("members");
            Predicate userPredicate = criteriaBuilder.equal(memberJoin.get("user").get("id"), userId);
            Predicate statusPredicate = criteriaBuilder.equal(memberJoin.get("status"), MemberStatus.ACTIVE);
            Join<Member, MemberRole> roleJoin = memberJoin.join("role");
            Predicate permissionsPredicate = criteriaBuilder.disjunction();
            for (WorkSpacePermission permission : permissions) {
                Predicate singlePermissionPredicate = criteriaBuilder.isMember(permission, roleJoin.get("workSpacePermissions"));
                permissionsPredicate = criteriaBuilder.or(permissionsPredicate, singlePermissionPredicate);
            }
            return criteriaBuilder.and(userPredicate, statusPredicate, permissionsPredicate);
        };
    }
}
