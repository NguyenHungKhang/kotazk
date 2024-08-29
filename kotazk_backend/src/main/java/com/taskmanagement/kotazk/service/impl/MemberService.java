package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.request.common.FilterCriteriaRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.member.MemberRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.member.MemberResponseDto;
import com.taskmanagement.kotazk.payload.response.memberrole.MemberRoleResponseDto;
import com.taskmanagement.kotazk.repository.*;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.util.BasicSpecificationUtil;
import com.taskmanagement.kotazk.util.ModelMapperUtil;
import com.taskmanagement.kotazk.util.SecurityUtil;
import com.taskmanagement.kotazk.util.TimeUtil;
import jakarta.persistence.criteria.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.*;

@Service
@Transactional
public class MemberService implements IMemberService {

    @Autowired
    private IMemberRepository memberRepository;
    @Autowired
    private IMemberRoleRepository memberRoleRepository;
    @Autowired
    private IUserRepository userRepository;
    @Autowired
    private IWorkSpaceRepository workSpaceRepository;
    @Autowired
    private IProjectRepository projectRepository;
    @Autowired
    private TimeUtil timeUtil;
    @Autowired
    BasicSpecificationUtil<Member> specificationUtil = new BasicSpecificationUtil<>();

    @Override
    public MemberResponseDto create(MemberRequestDto memberRequestDto) {
        User currentUser = SecurityUtil.getCurrentUser();
        User user = userRepository.findById(memberRequestDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", memberRequestDto.getWorkSpaceId()));
        MemberRole memberRole = memberRoleRepository.findById(memberRequestDto.getMemberRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("member role", "id", memberRequestDto.getMemberRoleId()));

        WorkSpace workSpace = null;
        Project project = null;

        if (memberRequestDto.getMemberFor().equals(EntityBelongsTo.WORK_SPACE)) {
            if (memberRequestDto.getWorkSpaceId() != null) {
                workSpace = workSpaceRepository.findById(memberRequestDto.getWorkSpaceId())
                        .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", memberRequestDto.getWorkSpaceId()));
                if (!memberRole.getRoleFor().equals(EntityBelongsTo.WORK_SPACE) ||
                        Objects.equals(memberRole.getWorkSpace().getId(), workSpace.getId()))
                    throw new CustomException("This member's role is not suitable with this workspace!");
                checkWorkSpaceMember(
                        currentUser.getId(),
                        workSpace.getId(),
                        Collections.singletonList(MemberStatus.ACTIVE),
                        Collections.singletonList(WorkSpacePermission.INVITE_MEMBER),
                        true
                );
            }
        } else if (memberRequestDto.getMemberFor().equals(EntityBelongsTo.PROJECT)) {
            if (memberRequestDto.getProjectId() != null) {
                project = projectRepository.findById(memberRequestDto.getProjectId())
                        .orElseThrow(() -> new ResourceNotFoundException("Project", "id", memberRequestDto.getProjectId()));
                if (!memberRole.getRoleFor().equals(EntityBelongsTo.PROJECT) ||
                        Objects.equals(memberRole.getWorkSpace().getId(), project.getId()))
                    throw new CustomException("This member's role is not suitable with this project!");
                checkProjectMember(
                        currentUser.getId(),
                        project.getId(),
                        Collections.singletonList(MemberStatus.ACTIVE),
                        Collections.singletonList(ProjectPermission.INVITE_MEMBER),
                        true
                );
                workSpace = project.getWorkSpace();
            }
        } else
            throw new CustomException("Invalid Input!");


        memberRepository.findByUserAndProjectOrWorkSpace(
                user.getId(),
                project != null ? project.getId() : null,
                workSpace != null ? workSpace.getId() : null
        ).ifPresent(existMember -> {
            throw new CustomException("This user is already a member");
        });


        Member newMember = Member.builder()
                .user(user)
                .memberFor(memberRequestDto.getMemberFor())
                .status(MemberStatus.ACTIVE)
                .role(memberRole)
                .workSpace(workSpace)
                .project(project)
                .build();

        Member savedMember = memberRepository.save(newMember);

        return ModelMapperUtil.mapOne(savedMember, MemberResponseDto.class);
    }

    @Override
    public MemberResponseDto revoke(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();

        Member currentMember = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", id));

        Member member = null;
        if (currentMember.getMemberFor().equals(EntityBelongsTo.PROJECT))
            member = checkProjectMember(
                    currentUser.getId(),
                    currentMember.getProject().getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(ProjectPermission.REVOKE_MEMBER),
                    true
            );
        else if (currentMember.getMemberFor().equals(EntityBelongsTo.WORK_SPACE))
            member = checkWorkSpaceMember(
                    currentUser.getId(),
                    currentMember.getWorkSpace().getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(WorkSpacePermission.REVOKE_MEMBER),
                    true
            );

        currentMember.setStatus(MemberStatus.BANNED);

        Member savedMember = memberRepository.save(currentMember);

        return ModelMapperUtil.mapOne(savedMember, MemberResponseDto.class);
    }

    @Override
    public Boolean delete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();

        Member currentMember = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", id));

        Member member = null;
        if (currentMember.getMemberFor().equals(EntityBelongsTo.PROJECT))
            member = checkProjectMember(
                    currentUser.getId(),
                    currentMember.getProject().getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(ProjectPermission.DELETE_MEMBER),
                    true
            );
        else if (currentMember.getMemberFor().equals(EntityBelongsTo.WORK_SPACE))
            member = checkWorkSpaceMember(
                    currentUser.getId(),
                    currentMember.getWorkSpace().getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(WorkSpacePermission.DELETE_MEMBER),
                    true
            );

        if (currentMember.getSystemRequired().equals(true))
            throw new CustomException("This member cannot be deleted");

        memberRepository.deleteById(currentMember.getId());
        return true;
    }

    @Override
    public Boolean softDelete(Long id) throws IOException, InterruptedException {
        User currentUser = SecurityUtil.getCurrentUser();
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        Member currentMember = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", id));

        Member member = null;
        if (currentMember.getMemberFor().equals(EntityBelongsTo.PROJECT))
            member = checkProjectMember(
                    currentUser.getId(),
                    currentMember.getProject().getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(ProjectPermission.DELETE_MEMBER),
                    true
            );
        else if (currentMember.getMemberFor().equals(EntityBelongsTo.WORK_SPACE))
            member = checkWorkSpaceMember(
                    currentUser.getId(),
                    currentMember.getWorkSpace().getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(WorkSpacePermission.DELETE_MEMBER),
                    true
            );

        if (currentMember.getSystemRequired().equals(true))
            throw new CustomException("This member cannot be deleted");

        currentMember.setDeletedAt(currentTime);
        memberRepository.deleteById(currentMember.getId());
        return true;
    }

    @Override
    public MemberResponseDto getOne(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        Member currentMember = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", id));
        Project project = currentMember.getProject();
        WorkSpace workSpace = currentMember.getWorkSpace();
        Member member = checkProjectAndWorkspaceBrowserPermission(currentUser, project, workSpace);

        return ModelMapperUtil.mapOne(currentMember, MemberResponseDto.class);
    }

    @Override
    public PageResponse<MemberResponseDto> getListPage(SearchParamRequestDto searchParam, Long workSpaceId, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Long userId = currentUser.getId();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        Project project = projectRepository.findById(projectId).orElse(null);
        WorkSpace workSpace = Optional.ofNullable(workSpaceRepository.findById(workSpaceId).orElse(null))
                .orElseGet(() -> Optional.ofNullable(project)
                        .map(Project::getWorkSpace)
                        .orElse(null));
        Member currentMember = checkProjectAndWorkspaceBrowserPermission(currentUser, project, workSpace);

        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "created_at"));

        Specification<Member> specification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Page<Member> page = memberRepository.findAll(specification, pageable);
        List<MemberResponseDto> dtoList = ModelMapperUtil.mapList(page.getContent(), MemberResponseDto.class);
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
    public Member checkWorkSpaceMember(
            Long userId,
            Long workspaceId,
            List<MemberStatus> statuses,
            List<WorkSpacePermission> workSpacePermissions,
            boolean isThrowException
    ) {
        if (workspaceId == null) {
            return null;
        }

        List<FilterCriteriaRequestDto> workspaceFilterList = new ArrayList<>();
        workspaceFilterList.add(new FilterCriteriaRequestDto("user.id", FilterOperator.EQUAL, userId.toString(), new ArrayList<>()));
        workspaceFilterList.add(new FilterCriteriaRequestDto("workSpace.id", FilterOperator.EQUAL, workspaceId.toString(), new ArrayList<>()));
        workspaceFilterList.add(new FilterCriteriaRequestDto("memberFor", FilterOperator.EQUAL, String.valueOf(EntityBelongsTo.WORK_SPACE), new ArrayList<>()));

        Member workspaceMember = memberRepository.findOne(specificationUtil.getSpecificationFromFilters(workspaceFilterList))
                .orElse(null);

        if (workspaceMember == null) {
            return handleResult("No member found for workspace id " + workspaceId, isThrowException);
        }

        if (statuses != null && !statuses.isEmpty() && !statuses.contains(workspaceMember.getStatus())) {
            return handleResult(String.format("Workspace member status %s is not in the allowed list: %s", workspaceMember.getStatus(), statuses), isThrowException);
        }

        if (workSpacePermissions != null && !workSpacePermissions.isEmpty()) {
            boolean hasWorkSpacePermission = workspaceMember.getRole().getWorkSpacePermissions().stream()
                    .anyMatch(workSpacePermissions::contains);
            if (!hasWorkSpacePermission) {
                return handleResult("Workspace member does not have the required permissions.", isThrowException);
            }
        }

        return workspaceMember;
    }

    @Override
    public Member checkProjectMember(
            Long userId,
            Long projectId,
            List<MemberStatus> statuses,
            List<ProjectPermission> projectPermissions,
            boolean isThrowException
    ) {
        if (projectId == null) {
            return null;
        }

        List<FilterCriteriaRequestDto> projectFilterList = new ArrayList<>();
        projectFilterList.add(new FilterCriteriaRequestDto("user.id", FilterOperator.EQUAL, userId.toString(), new ArrayList<>()));
        projectFilterList.add(new FilterCriteriaRequestDto("project.id", FilterOperator.EQUAL, projectId.toString(), new ArrayList<>()));
        projectFilterList.add(new FilterCriteriaRequestDto("memberFor", FilterOperator.EQUAL, String.valueOf(EntityBelongsTo.PROJECT), new ArrayList<>()));

        Member projectMember = memberRepository.findOne(specificationUtil.getSpecificationFromFilters(projectFilterList))
                .orElse(null);

        if (projectMember == null) {
            return handleResult("No member found for project id " + projectId, isThrowException);
        }

        if (statuses != null && !statuses.isEmpty() && !statuses.contains(projectMember.getStatus())) {
            return handleResult(String.format("Project member status %s is not in the allowed list: %s", projectMember.getStatus(), statuses), isThrowException);
        }

        if (projectPermissions != null && !projectPermissions.isEmpty()) {
            boolean hasProjectPermission = projectMember.getRole().getProjectPermissions().stream()
                    .anyMatch(projectPermissions::contains);
            if (!hasProjectPermission) {
                return handleResult("Project member does not have the required permissions.", isThrowException);
            }
        }

        return projectMember;
    }

    @Override
    public Member checkProjectAndWorkspaceBrowserPermission(User user, Project project, WorkSpace workspace) {

        if (project != null) {
            Member currentWorkSpaceMember = checkWorkSpaceMember(
                    user.getId(),
                    project.getWorkSpace().getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(
                            project.getVisibility().equals(Visibility.PRIVATE)
                                    ? WorkSpacePermission.BROWSE_PRIVATE_PROJECT
                                    : WorkSpacePermission.BROWSE_PUBLIC_PROJECT
                    ),
                    false
            );

            Member currentProjectMember = checkProjectMember(
                    user.getId(),
                    project.getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(ProjectPermission.BROWSE_PROJECT),
                    false
            );
            return Optional.ofNullable(currentProjectMember)
                    .orElse(Optional.ofNullable(currentWorkSpaceMember)
                            .orElseThrow(() -> new CustomException("Invalid input!")));
        } else if (workspace != null) {
            return checkWorkSpaceMember(
                    user.getId(),
                    workspace.getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(WorkSpacePermission.BROWSE_WORKSPACE),
                    true
            );
        } else throw new CustomException("Invalid input");
    }

    // Utility methods

    private Member handleResult(String errorMessage, boolean isThrowException) {
        if (isThrowException) {
            throw new CustomException(errorMessage);
        }
        System.out.println(errorMessage);
        return null;
    }


}
