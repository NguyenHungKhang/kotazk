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
    public Member initialMember(MemberRequestDto member) {
        User user = userRepository.findById(member.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", member.getWorkSpaceId()));
        MemberRole memberRole = memberRoleRepository.findById(member.getMemberRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("member role", "id", member.getMemberRoleId()));
        WorkSpace workSpace = null;
        Project project = null;

        if (member.getMemberFor().equals(EntityBelongsTo.WORK_SPACE)) {
            if (member.getWorkSpaceId() != null) {
                workSpace = workSpaceRepository.findById(member.getWorkSpaceId())
                        .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", member.getWorkSpaceId()));
                if (!memberRole.getRoleFor().equals(EntityBelongsTo.WORK_SPACE) ||
                        !Objects.equals(memberRole.getWorkSpace().getId(), workSpace.getId()))
                    throw new CustomException("This member's role is not suitable with this workspace!");

            }
        } else if (member.getMemberFor().equals(EntityBelongsTo.PROJECT)) {
            if (member.getProjectId() != null) {
                project = projectRepository.findById(member.getProjectId())
                        .orElseThrow(() -> new ResourceNotFoundException("Project", "id", member.getProjectId()));
                if (!memberRole.getRoleFor().equals(EntityBelongsTo.PROJECT) ||
                        !Objects.equals(memberRole.getProject().getId(), project.getId()))
                    throw new CustomException("This member's role is not suitable with this project!");
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

        Member newMember = ModelMapperUtil.mapOne(member, Member.class);
        newMember.setProject(project);
        newMember.setWorkSpace(workSpace);
        newMember.setRole(memberRole);
        newMember.setStatus(MemberStatus.ACTIVE);

        return memberRepository.save(newMember);
    }

    @Override
    public MemberResponseDto create(MemberRequestDto member) {
        User currentUser = SecurityUtil.getCurrentUser();
        User user = userRepository.findById(member.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", member.getWorkSpaceId()));
        MemberRole memberRole = memberRoleRepository.findById(member.getMemberRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("member role", "id", member.getMemberRoleId()));
        WorkSpace workSpace = null;
        Project project = null;

        if (member.getMemberFor().equals(EntityBelongsTo.WORK_SPACE)) {
            if (member.getWorkSpaceId() != null) {
                workSpace = workSpaceRepository.findById(member.getWorkSpaceId())
                        .orElseThrow(() -> new ResourceNotFoundException("Work space", "id", member.getWorkSpaceId()));
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
        } else if (member.getMemberFor().equals(EntityBelongsTo.PROJECT)) {
            if (member.getProjectId() != null) {
                project = projectRepository.findById(member.getProjectId())
                        .orElseThrow(() -> new ResourceNotFoundException("Project", "id", member.getProjectId()));
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


        Member newMember = ModelMapperUtil.mapOne(member, Member.class);
        newMember.setProject(project);
        newMember.setWorkSpace(workSpace);
        newMember.setRole(memberRole);
        newMember.setStatus(MemberStatus.ACTIVE);

        Member savedMember = memberRepository.save(newMember);

        return ModelMapperUtil.mapOne(savedMember, MemberResponseDto.class);
    }

    @Override
    public MemberResponseDto update(Long id, MemberRequestDto member) {
        User currentUser = SecurityUtil.getCurrentUser();

        Member currentMember = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", id));

        // Add check user permission

        if (member.getStatus() != null) currentMember.setStatus(member.getStatus());

        Member savedMember = memberRepository.save(currentMember);

        return ModelMapperUtil.mapOne(savedMember, MemberResponseDto.class);
    }

    @Override
    public Boolean delete(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();

        Member currentMember = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", id));

        // Add check user permission

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

        // Add check user permission

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

        // Add check user permission
        return ModelMapperUtil.mapOne(currentMember, MemberResponseDto.class);
    }

    @Override
    public PageResponse<MemberResponseDto> getListPage(SearchParamRequestDto searchParam, Long workSpaceId, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Long userId = currentUser.getId();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        // Add check user permission

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
    public Member checkMemberPermission(Long userId, Long workspaceId, Long projectId, String permission) {
        List<FilterCriteriaRequestDto> filterRequestList = new ArrayList<>();
        FilterCriteriaRequestDto filterRequest = FilterCriteriaRequestDto.builder()
                .key("user.id")
                .operation(FilterOperator.EQUAL)
                .value(userId.toString())
                .build();

        if (projectId != null) {
            FilterCriteriaRequestDto filterForProjectRequest = FilterCriteriaRequestDto.builder()
                    .key("project.id")
                    .operation(FilterOperator.EQUAL)
                    .value(projectId.toString())
                    .build();
            filterRequestList.add(filterForProjectRequest);
        }
        if (workspaceId != null) {
            FilterCriteriaRequestDto filterForWorkspaceRequest = FilterCriteriaRequestDto.builder()
                    .key("workSpace.id")
                    .operation(FilterOperator.EQUAL)
                    .value(workspaceId.toString())
                    .build();
            filterRequestList.add(filterForWorkspaceRequest);
        }

        Specification<Member> specification = specificationUtil.getSpecificationFromFilters(filterRequestList);
        Member currentMember = memberRepository.findOne(specification)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "user id", userId));

        boolean checkPermission = false;
        if (currentMember.getMemberFor().equals(EntityBelongsTo.WORK_SPACE))
            checkPermission = currentMember.getRole().getWorkSpacePermissions().contains(WorkSpacePermission.valueOf(permission));
        else if (currentMember.getMemberFor().equals(EntityBelongsTo.PROJECT))
            checkPermission = currentMember.getRole().getProjectPermissions().contains(ProjectPermission.valueOf(permission));
        else throw new CustomException("Invalid Input!");

        if (!checkPermission) throw new CustomException("Member does not have this permission");
        return currentMember;
    }

    @Override
    public Member checkMemberStatusAndPermission(Long userId, Long workspaceId, Long projectId, MemberStatus status, String permission) {
        List<FilterCriteriaRequestDto> filterRequestList = new ArrayList<>();
        FilterCriteriaRequestDto filterRequest = FilterCriteriaRequestDto.builder()
                .key("user.id")
                .operation(FilterOperator.EQUAL)
                .value(userId.toString())
                .build();

        if (projectId != null) {
            FilterCriteriaRequestDto filterForProjectRequest = FilterCriteriaRequestDto.builder()
                    .key("project.id")
                    .operation(FilterOperator.EQUAL)
                    .value(projectId.toString())
                    .build();
            filterRequestList.add(filterForProjectRequest);
        }
        if (workspaceId != null) {
            FilterCriteriaRequestDto filterForWorkspaceRequest = FilterCriteriaRequestDto.builder()
                    .key("workSpace.id")
                    .operation(FilterOperator.EQUAL)
                    .value(workspaceId.toString())
                    .build();
            filterRequestList.add(filterForWorkspaceRequest);
        }

        filterRequestList.add(filterRequest);
        Specification<Member> specification = specificationUtil.getSpecificationFromFilters(filterRequestList);
        Member currentMember = memberRepository.findOne(specification)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "user id", userId));

        if (!currentMember.getStatus().equals(status))
            throw new CustomException(String.format("Member status: %s", status));

        boolean checkPermission;
        if (currentMember.getMemberFor().equals(EntityBelongsTo.WORK_SPACE))
            checkPermission = currentMember.getRole().getWorkSpacePermissions().contains(WorkSpacePermission.valueOf(permission));
        else if (currentMember.getMemberFor().equals(EntityBelongsTo.PROJECT))
            checkPermission = currentMember.getRole().getProjectPermissions().contains(ProjectPermission.valueOf(permission));
        else throw new CustomException("Invalid Input!");

        if (!checkPermission) throw new CustomException("Member does not have this permission");
        return currentMember;
    }

    @Override
    public Member checkMemberStatus(Long userId, Long workspaceId, Long projectId, MemberStatus status) {
        List<FilterCriteriaRequestDto> filterRequestList = new ArrayList<>();
        FilterCriteriaRequestDto filterRequest = FilterCriteriaRequestDto.builder()
                .key("user.id")
                .operation(FilterOperator.EQUAL)
                .value(userId.toString())
                .build();

        if (projectId != null) {
            FilterCriteriaRequestDto filterForProjectRequest = FilterCriteriaRequestDto.builder()
                    .key("project.id")
                    .operation(FilterOperator.EQUAL)
                    .value(projectId.toString())
                    .build();
            filterRequestList.add(filterForProjectRequest);
        }
        if (workspaceId != null) {
            FilterCriteriaRequestDto filterForWorkspaceRequest = FilterCriteriaRequestDto.builder()
                    .key("workSpace.id")
                    .operation(FilterOperator.EQUAL)
                    .value(workspaceId.toString())
                    .build();
            filterRequestList.add(filterForWorkspaceRequest);
        }

        Specification<Member> specification = specificationUtil.getSpecificationFromFilters(filterRequestList);
        Member currentMember = memberRepository.findOne(specification)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "user id", userId));

        if (!currentMember.getStatus().equals(status))
            throw new CustomException(String.format("Member status: %s", status));
        return currentMember;
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

    private Member handleResult(String errorMessage, boolean isThrowException) {
        if (isThrowException) {
            throw new CustomException(errorMessage);
        }
        System.out.println(errorMessage);
        return null;
    }


}
