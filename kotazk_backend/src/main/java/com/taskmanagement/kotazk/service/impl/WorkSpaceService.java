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
import com.taskmanagement.kotazk.payload.response.notification.NotificationResponseDto;
import com.taskmanagement.kotazk.payload.response.project.ProjectResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceDetailResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceSummaryResponseDto;
import com.taskmanagement.kotazk.repository.*;
import com.taskmanagement.kotazk.service.*;
import com.taskmanagement.kotazk.util.*;
import jakarta.persistence.criteria.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    INotificationService notificationService = new NotificationService();
    @Autowired
    private INotificationRepository notificationRepository;
    @Autowired
    private FileUtil fileUtil;
    @Autowired
    private IActivityLogRepository activityLogRepository;

    @Override
    public WorkSpaceDetailResponseDto initialWorkSpace(WorkSpaceRequestDto workSpaceDto) {
        User currentUser = SecurityUtil.getCurrentUser();

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
                .key(generateUniqueKey())
                .memberRoles(new HashSet<>(memberRoles))
                .members(Collections.singletonList(member))
                .build();

        memberRoles.forEach(role -> role.setWorkSpace(newWorkSpace));
        member.setWorkSpace(newWorkSpace);

        WorkSpace saveWorkSpace = workSpaceRepository.save(newWorkSpace);

        ActivityLog taskActivityLog = activityLogWorkspaceTemplate(saveWorkSpace, currentUser, String.format("create this workspace"));
        activityLogRepository.save(taskActivityLog);

        createNotificationForAllMembers(currentUser, saveWorkSpace, "Workspace has been created", "Workspace has been created by user " + currentUser.getEmail(), "/workspace/" + saveWorkSpace.getId());

        return ModelMapperUtil.mapOne(saveWorkSpace, WorkSpaceDetailResponseDto.class);
    }

    @Override
    public WorkSpaceDetailResponseDto update(Long id, WorkSpaceRequestDto workSpace) {
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace currentWorkSpace = workSpaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", id));

        Member currentMember = checkWorkspaceSettingPermission(currentUser.getId(), currentWorkSpace.getId());

        List<ActivityLog> activityLogs = new ArrayList<>();

        String oldName = workSpace.getName();

        if(workSpace.getName() != null) {
            currentWorkSpace.setName(workSpace.getName());
            ActivityLog wokspaceActivityLog = activityLogWorkspaceTemplate(currentWorkSpace, currentUser, String.format("changed workspace name to \"%s\"", workSpace.getName()));
            activityLogs.add(wokspaceActivityLog);
        }

        if(workSpace.getDescription() != null) {
            currentWorkSpace.setDescription(workSpace.getDescription());
            ActivityLog wokspaceActivityLog = activityLogWorkspaceTemplate(currentWorkSpace, currentUser, String.format("changed workspace description"));
            activityLogs.add(wokspaceActivityLog);
        }

        WorkSpace savedWorkspace =  workSpaceRepository.save(currentWorkSpace);
        activityLogRepository.saveAll(activityLogs);
        createNotificationForAllMembers(currentUser, savedWorkspace,
                "Workspace has been updated",
                "Workspace \"" + oldName + "\" has been updated by user " + currentUser.getEmail(),
                "/workspace/" + savedWorkspace.getId() + "/dashboard");

        return ModelMapperUtil.mapOne(savedWorkspace, WorkSpaceDetailResponseDto.class);
    }

    @Override
    public WorkSpaceDetailResponseDto uploadCover(MultipartFile file, Long workspaceId) throws IOException {
        User currentUser = SecurityUtil.getCurrentUser();
        WorkSpace workSpace = workSpaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace", "id", workspaceId));

        Member currentMember = memberService.checkProjectMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                new ArrayList<>(),
                true
        );

        if (!currentMember.getRole().getProjectPermissions().contains(ProjectPermission.MODIFY_PROJECT))
            throw new CustomException("This user do not have permission to add attachment in this task");


        String url = workSpace.getCover();
        if (url != null)
            fileUtil.deleteFile(url);

        String fileUrl = fileUtil.uploadFile(file, "cover-workspace-" + workSpace.getId() + "-" + UUID.randomUUID().toString());
        workSpace.setCover(fileUrl);
        WorkSpace savedWorkspace = workSpaceRepository.save(workSpace);
        ActivityLog taskActivityLog = activityLogWorkspaceTemplate(savedWorkspace, currentUser, String.format("uploaded workspace cover."));
        activityLogRepository.save(taskActivityLog);

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

        createNotificationForAllMembers(currentUser, currentWorkSpace,
                "Workspace has been deleted",
                "Workspace \"" + currentWorkSpace.getName() + "\" has been deleted by user " + currentUser.getEmail(),
                null);

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

    private void createNotificationForAllMembers(User currentUser, WorkSpace workSpace, String title, String message, String actionUrl) {
        List<Notification> notifications = workSpace.getMembers().stream().filter(m -> m.getMemberFor().equals(EntityBelongsTo.WORK_SPACE)).map(m -> {
            Notification notification = new Notification();
            notification.setUser(m.getUser()); // Ensure User is fully initialized
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setActionUrl(actionUrl);
            return notification;
        }).toList();

        List<Notification> savedNotification = notificationRepository.saveAll(notifications);

        // Ensure that relationships are fully loaded if needed
        savedNotification.stream().filter(n -> n.getUser().getId() == currentUser.getId()).forEach(notification -> {
            // Map Notification to NotificationResponseDto
            NotificationResponseDto responseDto = ModelMapperUtil.mapOne(notification, NotificationResponseDto.class);
            messagingTemplate.convertAndSend("/topic/notifications", responseDto);
        });
    }

    private ActivityLog activityLogWorkspaceTemplate(WorkSpace workSpace, User user, String content) {
        ActivityLog activityLogTemplate = new ActivityLog();
        activityLogTemplate.setWorkSpace(workSpace);
        activityLogTemplate.setUser(user);
        activityLogTemplate.setUserText(user.getFirstName() + " " + user.getLastName() + " ("+ user.getEmail() +")");
        activityLogTemplate.setSystemInitial(true);
        activityLogTemplate.setSystemRequired(false);
        activityLogTemplate.setType(ActivityLogType.WORKSPACE_HISTORY);
        activityLogTemplate.setContent(content);

        return activityLogTemplate;
    }
}
