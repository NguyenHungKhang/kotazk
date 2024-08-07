package com.taskmanagement.kotazk.service;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.member.MemberRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.member.MemberResponseDto;

import java.io.IOException;

public interface IMemberService {
    MemberResponseDto create(MemberRequestDto memberRole);
    MemberResponseDto update(MemberRequestDto memberRole);
    Boolean delete(Long id);
    Boolean softDelete(Long id) throws IOException, InterruptedException;
    MemberResponseDto getOne(Long id);
    PageResponse<MemberResponseDto> getList(SearchParamRequestDto searchParam, Long workSpaceId, Long projectId);
}
