package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.MemberRole;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.memberrole.MemberRoleRequestDto;
import com.taskmanagement.kotazk.payload.request.memberrole.RepositionMemberRoleRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.memberrole.MemberRoleResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceSummaryResponseDto;

import java.io.IOException;
import java.util.List;
import java.util.Set;

public interface IMemberRoleService {
    MemberRoleResponseDto create(MemberRoleRequestDto memberRole);
    MemberRoleResponseDto update(Long id, MemberRoleRequestDto memberRole);
    Boolean delete(Long id);
    Boolean softDelete(Long id) throws IOException, InterruptedException;
    MemberRoleResponseDto getOne(Long id);
    Boolean rePosition(RepositionMemberRoleRequestDto repositionMemberRole);
    PageResponse<MemberRoleResponseDto> getListPage(SearchParamRequestDto searchParam, Long workSpaceId, Long projectId);
    List<MemberRole> initialMemberRole(Long workSpaceId, Long projectId);
}
