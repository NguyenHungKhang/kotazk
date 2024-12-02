package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.Member;
import com.taskmanagement.kotazk.entity.Project;
import com.taskmanagement.kotazk.entity.User;
import com.taskmanagement.kotazk.entity.WorkSpace;
import com.taskmanagement.kotazk.entity.enums.MemberStatus;
import com.taskmanagement.kotazk.entity.enums.ProjectPermission;
import com.taskmanagement.kotazk.entity.enums.WorkSpacePermission;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.member.MemberInviteRequestDto;
import com.taskmanagement.kotazk.payload.request.member.MemberRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.member.MemberResponseDto;

import java.io.IOException;
import java.util.List;

public interface IMemberService {
    MemberResponseDto create(MemberRequestDto member);
    MemberResponseDto updateStatus(MemberRequestDto memberRequestDto, Long id);
    List<MemberResponseDto> inviteList(MemberInviteRequestDto memberInviteRequestDto);
    MemberResponseDto revoke(Long id);
    Boolean delete(Long id);
    Boolean softDelete(Long id) throws IOException, InterruptedException;
    MemberResponseDto getOne(Long id);
    MemberResponseDto getCurrentOne(Long projectId);
    PageResponse<MemberResponseDto> getListPageByWorkspace(SearchParamRequestDto searchParam, Long workspaceId);
    PageResponse<MemberResponseDto> getListPageByProject(SearchParamRequestDto searchParam, Long projectId);
    Member checkProjectMember(
            Long userId,
            Long projectId,
            List<MemberStatus> statuses,
            List<ProjectPermission> projectPermissions,
            boolean isThrowException
    );

    Member checkWorkSpaceMember(
            Long userId,
            Long workspaceId,
            List<MemberStatus> statuses,
            List<WorkSpacePermission> workSpacePermissions,
            boolean isThrowException
    );
    Member checkProjectAndWorkspaceBrowserPermission(User user, Project project, WorkSpace workSpace);
}
