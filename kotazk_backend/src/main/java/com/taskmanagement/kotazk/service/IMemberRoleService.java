package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.entity.MemberRole;
import com.taskmanagement.kotazk.payload.request.common.RePositionRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.memberrole.MemberRoleRequestDto;
import com.taskmanagement.kotazk.payload.request.memberrole.RepositionMemberRoleRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.common.RePositionResponseDto;
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
    RePositionResponseDto rePositionByProject(RePositionRequestDto rePositionRequestDto, Long projectId);
    RePositionResponseDto rePositionByWorkspace(RePositionRequestDto rePositionRequestDto, Long workspaceId);
    PageResponse<MemberRoleResponseDto> getListPage(SearchParamRequestDto searchParam, Long workSpaceId, Long projectId);
    List<MemberRole> initialMemberRole(Boolean forWorkSpace);
}
