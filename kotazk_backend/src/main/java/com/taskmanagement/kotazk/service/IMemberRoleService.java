package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.memberrole.MemberRoleRequestDto;
import com.taskmanagement.kotazk.payload.request.memberrole.RepositionMemberRoleRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.memberrole.MemberRoleResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceSummaryResponseDto;

import java.io.IOException;

public interface IMemberRoleService {
    MemberRoleResponseDto create(MemberRoleRequestDto memberRole);
    MemberRoleResponseDto update(Long id, MemberRoleRequestDto memberRole);
    Boolean delete(Long id);
    Boolean softDelete(Long id) throws IOException, InterruptedException;
    MemberRoleRequestDto getOne(Long id);
    Boolean rePosition(RepositionMemberRoleRequestDto repositionMemberRole);
    PageResponse<WorkSpaceSummaryResponseDto> getList(SearchParamRequestDto searchParam, Long workSpaceId, Long projectId);
}
