package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.member.MemberRequestDto;
import com.taskmanagement.kotazk.payload.request.memberrole.MemberRoleRequestDto;
import com.taskmanagement.kotazk.payload.request.memberrole.RepositionMemberRoleRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.member.MemberResponseDto;
import com.taskmanagement.kotazk.payload.response.memberrole.MemberRoleResponseDto;
import com.taskmanagement.kotazk.service.IMemberRoleService;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.impl.MemberRoleService;
import com.taskmanagement.kotazk.service.impl.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberController {
    @Autowired
    IMemberService memberService = new MemberService();

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public MemberResponseDto create(@Valid @RequestBody MemberRequestDto memberRequest) {
        return memberService.create(memberRequest, false);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public MemberResponseDto update(@Valid @RequestBody MemberRequestDto memberRequest, @PathVariable Long id) {
        return memberService.update(id, memberRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean delete(@PathVariable Long id) {
        return memberService.delete(id);
    }

    @PatchMapping("/soft/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean softDelete(@PathVariable Long id) throws IOException, InterruptedException {
        return memberService.softDelete(id);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public MemberResponseDto getOne(@PathVariable Long id) {
        return memberService.getOne(id);
    }

    @PostMapping("/page")
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<MemberResponseDto> search(
            @RequestParam(required = false) Long workspaceId,
            @RequestParam(required = false) Long projectId,
            @RequestBody SearchParamRequestDto searchParam) {
        return memberService.getListPage(searchParam, workspaceId, projectId);
    }
}
