package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.*;
import com.taskmanagement.kotazk.entity.enums.*;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.payload.CustomResponse;
import com.taskmanagement.kotazk.payload.request.common.FilterCriteriaRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.member.MemberInviteRequestDto;
import com.taskmanagement.kotazk.payload.request.member.MemberRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.member.MemberDetailResponseDto;
import com.taskmanagement.kotazk.payload.response.member.MemberResponseDto;
import com.taskmanagement.kotazk.repository.*;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.util.*;
import jakarta.mail.MessagingException;
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
import java.sql.Array;
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
    private SendEmailUtil sendEmailUtil;
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
                        Collections.singletonList(WorkSpacePermission.MANAGE_MEMBER),
                        true
                );
            }
        } else if (memberRequestDto.getMemberFor().equals(EntityBelongsTo.PROJECT)) {
            if (memberRequestDto.getProjectId() != null) {
                project = projectRepository.findById(memberRequestDto.getProjectId())
                        .orElseThrow(() -> new ResourceNotFoundException("Project", "id", memberRequestDto.getProjectId()));
                if (!memberRole.getRoleFor().equals(EntityBelongsTo.PROJECT) ||
                        !Objects.equals(memberRole.getProject().getId(), project.getId()))
                    throw new CustomException("This member's role is not suitable with this project!");
                checkProjectMember(
                        currentUser.getId(),
                        project.getId(),
                        Collections.singletonList(MemberStatus.ACTIVE),
                        Collections.singletonList(ProjectPermission.MANAGE_MEMBER),
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
                .status(MemberStatus.INVITED)
                .role(memberRole)
                .workSpace(workSpace)
                .project(project)
                .systemInitial(false)
                .systemRequired(false)
                .build();

        Member savedMember = memberRepository.save(newMember);

        return ModelMapperUtil.mapOne(savedMember, MemberResponseDto.class);
    }

    @Override
    public MemberResponseDto updateStatus(MemberRequestDto memberRequestDto, Long id) {
        User currentUser = SecurityUtil.getCurrentUser();

        Member currentMember = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", id));

        Member member = null;
        if (currentMember.getMemberFor().equals(EntityBelongsTo.PROJECT))
            member = checkProjectMember(
                    currentUser.getId(),
                    currentMember.getProject().getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(ProjectPermission.MANAGE_MEMBER),
                    true
            );
        else if (currentMember.getMemberFor().equals(EntityBelongsTo.WORK_SPACE))
            member = checkWorkSpaceMember(
                    currentUser.getId(),
                    currentMember.getWorkSpace().getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(WorkSpacePermission.MANAGE_MEMBER),
                    true
            );

        currentMember.setStatus(memberRequestDto.getStatus());

        Member savedMember = memberRepository.save(currentMember);

        return ModelMapperUtil.mapOne(savedMember, MemberResponseDto.class);
    }

    @Override
    public List<MemberResponseDto> inviteList(MemberInviteRequestDto memberInviteRequestDto) throws MessagingException {
        User currentUser = SecurityUtil.getCurrentUser();
        Optional<Project> project = projectRepository.findById(memberInviteRequestDto.getProjectId());
        Optional<WorkSpace> workspace = workSpaceRepository.findById(memberInviteRequestDto.getWorkspaceId());
        MemberRole memberRole = memberRoleRepository.findById(memberInviteRequestDto.getMemberRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Member role", "id", memberInviteRequestDto.getMemberRoleId()));
        List<Member> savedMembers = new ArrayList<>();
        if (project.isPresent()) {
            if (!memberRole.getRoleFor().equals(EntityBelongsTo.PROJECT) || memberRole.getProject().getId() != project.get().getId())
                return null;

            List<Member> members = memberInviteRequestDto.getItems().stream()
                    .map(item -> {
                        Member member;
                        if (item.getId() != null) {

                            Optional<Member> projectMember = project.get().getMembers().stream()
                                    .filter(pm -> pm.getId() == item.getId())
                                    .findFirst();

                            Optional<Member> workspaceMember = project.get().getWorkSpace().getMembers().stream()
                                    .filter(pm -> pm.getId() == item.getId())
                                    .findFirst();
                            if (projectMember.isPresent()) {
                                member = projectMember.get();
                                if (member.getId() != project.get().getMember().getId()) {
                                    member.setRole(memberRole);
                                }
                            } else if (workspaceMember.isPresent()) {
                                member = new Member();
                                member.setEmail(workspaceMember.get().getEmail());
                                member.setStatus(MemberStatus.INVITED);
                                member.setUser(workspaceMember.get().getUser());
                                member.setMemberFor(EntityBelongsTo.PROJECT);
                                member.setProject(project.get());
                                member.setWorkSpace(null);
                                member.setRole(memberRole);
                                member.setSystemInitial(false);
                                member.setSystemRequired(false);

                            } else throw new CustomException("Invalid input!");
                        } else {
                            Optional<User> existUser = userRepository.findByEmail(item.getEmail());
                            member = new Member();
                            member.setEmail(item.getEmail());
                            member.setStatus(MemberStatus.INVITED);
                            member.setUser(existUser.isPresent() ? existUser.get() : null);
                            member.setMemberFor(EntityBelongsTo.PROJECT);
                            member.setProject(project.get());
                            member.setWorkSpace(null);
                            member.setRole(memberRole);
                            member.setSystemInitial(false);
                            member.setSystemRequired(false);
                        }
                        return member;
                    }).toList();
            savedMembers.addAll(members);
        } else if (workspace.isPresent()) {
            if (!memberRole.getRoleFor().equals(EntityBelongsTo.WORK_SPACE) || memberRole.getWorkSpace().getId() != workspace.get().getId())
                return null;
            List<Member> members = memberInviteRequestDto.getItems().stream()
                    .map(item -> {
                        Member member;
                        if (item.getId() != null) {
                            member = workspace.get().getMembers().stream()
                                    .filter(pm -> pm.getId() == item.getId())
                                    .findFirst()
                                    .orElseThrow(() -> new CustomException("Invalid input"));
                            if (member.getUser().getId() != workspace.get().getUser().getId()) {
                                member.setRole(memberRole);
                            }
                        } else {
                            Optional<User> existUser = userRepository.findByEmail(item.getEmail());
                            member = new Member();
                            member.setEmail(item.getEmail());
                            member.setStatus(MemberStatus.INVITED);
                            member.setUser(existUser.isPresent() ? existUser.get() : null);
                            member.setMemberFor(EntityBelongsTo.WORK_SPACE);
                            member.setProject(null);
                            member.setWorkSpace(workspace.get());
                            member.setRole(memberRole);
                            member.setSystemInitial(false);
                            member.setSystemRequired(false);
                        }
                        return member;
                    }).toList();
            savedMembers.addAll(members);
        }
        memberRepository.saveAll(savedMembers);

        List<String> emails = savedMembers.stream().map(m -> m.getEmail()).toList();

        if(!emails.isEmpty()) {
            if (project.isPresent()) sendProjectInvitationEmail(emails, project.get().getName(), project.get().getMember().getUser().getEmail());
            else if (workspace.isPresent()) sendWorkspaceInvitationEmail(emails, workspace.get().getName(), workspace.get().getUser().getEmail());
        }


        return null;
    }

    @Override
    public MemberResponseDto revoke(Long id) {
//        User currentUser = SecurityUtil.getCurrentUser();
//
//        Member currentMember = memberRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", id));
//
//        Member member = null;
//        if (currentMember.getMemberFor().equals(EntityBelongsTo.PROJECT))
//            member = checkProjectMember(
//                    currentUser.getId(),
//                    currentMember.getProject().getId(),
//                    Collections.singletonList(MemberStatus.ACTIVE),
//                    Collections.singletonList(ProjectPermission.REVOKE_MEMBER),
//                    true
//            );
//        else if (currentMember.getMemberFor().equals(EntityBelongsTo.WORK_SPACE))
//            member = checkWorkSpaceMember(
//                    currentUser.getId(),
//                    currentMember.getWorkSpace().getId(),
//                    Collections.singletonList(MemberStatus.ACTIVE),
//                    Collections.singletonList(WorkSpacePermission.REVOKE_MEMBER),
//                    true
//            );
//
//        currentMember.setStatus(MemberStatus.BANNED);
//
//        Member savedMember = memberRepository.save(currentMember);

        return null;
    }

    @Override
    public CustomResponse acceptInvite(Long id) {
        User currentUser = SecurityUtil.getCurrentUser();
        Member currentMember = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "id", id));

        if (currentUser.getId() != currentMember.getUser().getId())
            throw new CustomException("You cannot accept invite of another user!");

        List<Member> saveMembers = new ArrayList<>();
        currentMember.setStatus(MemberStatus.ACTIVE);
        saveMembers.add(currentMember);

        if (currentMember.getMemberFor() == EntityBelongsTo.PROJECT) {
            Optional<Member> workspaceMember = currentMember.getProject().getWorkSpace().getMembers().stream().filter(m -> m.getUser().getId() == currentUser.getId()).findFirst();
            if (workspaceMember.isPresent()) {
                workspaceMember.get().setStatus(MemberStatus.ACTIVE);
                saveMembers.add(workspaceMember.get());
            } else {
                Member newWorkspaceMember = new Member();
                newWorkspaceMember.setEmail(currentMember.getEmail());
                newWorkspaceMember.setStatus(MemberStatus.ACTIVE);
                newWorkspaceMember.setUser(currentUser);
                newWorkspaceMember.setMemberFor(EntityBelongsTo.WORK_SPACE);
                newWorkspaceMember.setProject(null);
                newWorkspaceMember.setWorkSpace(currentMember.getProject().getWorkSpace());
                newWorkspaceMember.setRole(currentMember.getProject().getWorkSpace().getMemberRoles().stream()
                        .filter(r ->  Objects.equals(r.getName(), "Editor") && r.getSystemInitial() == true && r.getRoleFor() == EntityBelongsTo.WORK_SPACE)
                        .findFirst()
                        .orElseThrow(() -> {
                            throw new CustomException("Something wrong!");
                        }));
                newWorkspaceMember.setSystemInitial(false);
                newWorkspaceMember.setSystemRequired(false);
                saveMembers.add(newWorkspaceMember);
            }

        }

        memberRepository.saveAll(saveMembers);

        CustomResponse customResponse = new CustomResponse();
        customResponse.setSuccess(true);
        customResponse.setMessage("Invitation accepted");

        return customResponse;
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
                    Collections.singletonList(ProjectPermission.MANAGE_MEMBER),
                    true
            );
        else if (currentMember.getMemberFor().equals(EntityBelongsTo.WORK_SPACE))
            member = checkWorkSpaceMember(
                    currentUser.getId(),
                    currentMember.getWorkSpace().getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(WorkSpacePermission.MANAGE_MEMBER),
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
                    Collections.singletonList(ProjectPermission.MANAGE_MEMBER),
                    true
            );
        else if (currentMember.getMemberFor().equals(EntityBelongsTo.WORK_SPACE))
            member = checkWorkSpaceMember(
                    currentUser.getId(),
                    currentMember.getWorkSpace().getId(),
                    Collections.singletonList(MemberStatus.ACTIVE),
                    Collections.singletonList(WorkSpacePermission.MANAGE_MEMBER),
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
    public MemberResponseDto getCurrentOne(Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Timestamp currentTime = timeUtil.getCurrentUTCTimestamp();

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        Member member = project.getMembers().stream()
                .filter(m -> m.getUser().getId() == currentUser.getId())
                .findFirst()
                .orElseThrow(() -> new CustomException(String.format("User %s is not a member of project %s", currentUser.getLastName(), project.getName())));

        return ModelMapperUtil.mapOne(member, MemberResponseDto.class);
    }

    @Override
    public PageResponse<MemberResponseDto> getListPageByWorkspace(SearchParamRequestDto searchParam, Long workspaceId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Long userId = currentUser.getId();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        WorkSpace workSpace = workSpaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("WorkSpace", "id", workspaceId));

        Member currentMember = checkWorkSpaceMember(
                currentUser.getId(),
                workSpace.getId(),
                Collections.singletonList(MemberStatus.ACTIVE),
                Collections.singletonList(WorkSpacePermission.BROWSE_WORKSPACE),
                true
        );

        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "created_at"));

        Specification<Member> workspaceSpecification = (Root<Member> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<Member, WorkSpace> projectJoin = root.join("workSpace");
            return criteriaBuilder.equal(projectJoin.get("id"), workSpace.getId());
        };

        Specification<Member> filterSpecification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Specification<Member> specification = Specification.where(workspaceSpecification)
                .and(filterSpecification);

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
    public PageResponse<MemberResponseDto> getListPageByProject(SearchParamRequestDto searchParam, Long projectId) {
        User currentUser = SecurityUtil.getCurrentUser();
        Long userId = currentUser.getId();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        WorkSpace workSpace = project.getWorkSpace();
        Member currentMember = checkProjectAndWorkspaceBrowserPermission(currentUser, project, workSpace);

        Pageable pageable = PageRequest.of(
                searchParam.getPageNum(),
                searchParam.getPageSize(),
                Sort.by(searchParam.getSortDirectionAsc() ? Sort.Direction.ASC : Sort.Direction.DESC,
                        searchParam.getSortBy() != null ? searchParam.getSortBy() : "created_at"));

        Specification<Member> projectSpecification = (Root<Member> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            Join<Member, Project> projectJoin = root.join("project");
            return criteriaBuilder.equal(projectJoin.get("id"), project.getId());
        };

        Specification<Member> filterSpecification = specificationUtil.getSpecificationFromFilters(searchParam.getFilters());

        Specification<Member> specification = Specification.where(projectSpecification)
                .and(filterSpecification);

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
    public List<MemberDetailResponseDto> getOwnInvitation() {
        User currentUser = SecurityUtil.getCurrentUser();
        Long userId = currentUser.getId();
        boolean isAdmin = currentUser.getRole().equals(Role.ADMIN);

        FilterCriteriaRequestDto filterCriteriaRequestDto = new FilterCriteriaRequestDto();
        filterCriteriaRequestDto.setKey("user.id");
        filterCriteriaRequestDto.setOperation(FilterOperator.EQUAL);
        filterCriteriaRequestDto.setValue(currentUser.getId().toString());

        FilterCriteriaRequestDto activeFilterCriteriaRequestDto = new FilterCriteriaRequestDto();
        activeFilterCriteriaRequestDto.setKey("status");
        activeFilterCriteriaRequestDto.setOperation(FilterOperator.EQUAL);
        activeFilterCriteriaRequestDto.setValue(MemberStatus.INVITED.toString());

        List<FilterCriteriaRequestDto> filterCriteriaRequestDtos = new ArrayList<>();
        filterCriteriaRequestDtos.add(filterCriteriaRequestDto);
        filterCriteriaRequestDtos.add(activeFilterCriteriaRequestDto);

        Specification<Member> specification = specificationUtil.getSpecificationFromFilters(filterCriteriaRequestDtos);

        List<Member> list = memberRepository.findAll(specification);
        List<MemberDetailResponseDto> dtoList = ModelMapperUtil.mapList(list, MemberDetailResponseDto.class);
        return dtoList;
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
        workspaceFilterList.add(new FilterCriteriaRequestDto("user.id", FilterOperator.EQUAL, userId.toString(), new ArrayList<>(), false, false));
        workspaceFilterList.add(new FilterCriteriaRequestDto("workSpace.id", FilterOperator.EQUAL, workspaceId.toString(), new ArrayList<>(), false, false));
        workspaceFilterList.add(new FilterCriteriaRequestDto("memberFor", FilterOperator.EQUAL, String.valueOf(EntityBelongsTo.WORK_SPACE), new ArrayList<>(), false, false));

        System.out.println(workspaceFilterList);

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
        projectFilterList.add(new FilterCriteriaRequestDto("user.id", FilterOperator.EQUAL, userId.toString(), new ArrayList<>(), false, false));
        projectFilterList.add(new FilterCriteriaRequestDto("project.id", FilterOperator.EQUAL, projectId.toString(), new ArrayList<>(), false, false));
        projectFilterList.add(new FilterCriteriaRequestDto("memberFor", FilterOperator.EQUAL, String.valueOf(EntityBelongsTo.PROJECT), new ArrayList<>(), false, false));

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

            if (currentProjectMember != null) return currentProjectMember;
            else if (currentWorkSpaceMember != null) return currentWorkSpaceMember;
            else throw new CustomException("Invalid input!");

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
//        System.out.println(errorMessage);
        return null;
    }

    public void sendProjectInvitationEmail(List<String> emails, String projectName, String ownerEmail) throws MessagingException {
        String subject = "You're Invited to Join the Project: " + projectName;
        String body = """
            <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #eaeaea; border-radius: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #3D42E9; color: white; padding: 15px 20px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                    <h1>Project Invitation - Kotazk</h1>
                </div>
                <div style="padding: 20px;">
                    <p>Hi there,</p>
                    <p>You’ve been invited to collaborate on the project <strong>""" + projectName + """
                    </strong>!</p>
                    <p>This project is managed by <strong>""" + ownerEmail + """
                    </strong>, who believes your participation is vital for its success.</p>
                    <p>To accept this invitation and start collaborating:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="https://kotazk.com/invite/accept?project=""" + projectName + """
                &email=""" + ownerEmail + """
                            style="display: inline-block; background-color: #3D42E9; color: white; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 5px;">
                            Join Project
                        </a>
                    </div>
                    <p>If you believe this was sent to you by mistake, please ignore this email or contact our support team.</p>
                </div>
                <div style="background-color: #f1f1f1; padding: 10px 20px; text-align: center; font-size: 14px; color: #777; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                    <p>© 2024 Kotazk. All rights reserved.</p>
                    <p><a href="https://kotazk.com" style="color: #3D42E9; text-decoration: none;">Visit our website</a> | <a href="mailto:support@kotazk.com" style="color: #3D42E9; text-decoration: none;">Contact Support</a></p>
                </div>
            </div>
            """;

        sendEmailUtil.sendEmail(emails, subject, body);
    }

    public void sendWorkspaceInvitationEmail(List<String> emails, String workspaceName, String ownerEmail) throws MessagingException {
        String subject = "You're Invited to Join the Workspace: " + workspaceName;
        String body = """
            <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #eaeaea; border-radius: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #3D42E9; color: white; padding: 15px 20px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                    <h1>Workspace Invitation - Kotazk</h1>
                </div>
                <div style="padding: 20px;">
                    <p>Hi there,</p>
                    <p>You’ve been invited to collaborate in the workspace <strong>""" + workspaceName + """
                    </strong>!</p>
                    <p>This workspace is managed by <strong>""" + ownerEmail + """
                    </strong>, who believes your participation is crucial for its success.</p>
                    <p>To accept this invitation and start collaborating:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="https://kotazk.com/invite/accept?workspace=""" + workspaceName + """
                &email=""" + ownerEmail + """
                           style="display: inline-block; background-color: #3D42E9; color: white; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 5px;">
                            Join Workspace
                        </a>
                    </div>
                    <p>If you believe this was sent to you by mistake, please ignore this email or contact our support team.</p>
                </div>
                <div style="background-color: #f1f1f1; padding: 10px 20px; text-align: center; font-size: 14px; color: #777; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                    <p>© 2024 Kotazk. All rights reserved.</p>
                    <p><a href="https://kotazk.com" style="color: #3D42E9; text-decoration: none;">Visit our website</a> | <a href="mailto:support@kotazk.com" style="color: #3D42E9; text-decoration: none;">Contact Support</a></p>
                </div>
            </div>
            """;

        sendEmailUtil.sendEmail(emails, subject, body);
    }


}
