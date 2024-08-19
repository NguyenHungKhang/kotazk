package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.Member;
import com.taskmanagement.kotazk.entity.enums.MemberStatus;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.member.MemberRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.member.MemberResponseDto;

import java.io.IOException;
import java.util.List;

public interface IMemberService {
    Member initialMember(MemberRequestDto member);
    MemberResponseDto create(MemberRequestDto member);
    MemberResponseDto update(Long id, MemberRequestDto member);
    Boolean delete(Long id);
    Boolean softDelete(Long id) throws IOException, InterruptedException;
    MemberResponseDto getOne(Long id);
    PageResponse<MemberResponseDto> getListPage(SearchParamRequestDto searchParam, Long workSpaceId, Long projectId);
    Member checkMemberPermission(Long userId, Long workspaceId, Long projectId, String permission);
    Member checkMemberStatusAndPermission(Long userId, Long workspaceId, Long projectId, MemberStatus status, String permission);
    Member checkMemberStatus(Long userId, Long workspaceId, Long projectId, MemberStatus status);
    Member checkMemberStatusesAndPermissions(Long userId, Long workspaceId, Long projectId, List<MemberStatus> statuses, List<String> permissions);
}
