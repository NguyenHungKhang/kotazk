package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.CustomResponse;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.member.MemberInviteRequestDto;
import com.taskmanagement.kotazk.payload.request.member.MemberRequestDto;
import com.taskmanagement.kotazk.payload.request.memberrole.MemberRoleRequestDto;
import com.taskmanagement.kotazk.payload.request.memberrole.RepositionMemberRoleRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.member.MemberDetailResponseDto;
import com.taskmanagement.kotazk.payload.response.member.MemberResponseDto;
import com.taskmanagement.kotazk.payload.response.memberrole.MemberRoleResponseDto;
import com.taskmanagement.kotazk.service.IMemberRoleService;
import com.taskmanagement.kotazk.service.IMemberService;
import com.taskmanagement.kotazk.service.impl.MemberRoleService;
import com.taskmanagement.kotazk.service.impl.MemberService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

import static com.taskmanagement.kotazk.config.ConstantConfig.DEFAULT_ENDPOINT_SECURE_PART;

@RestController
@RequestMapping(DEFAULT_ENDPOINT_SECURE_PART + "/member")
@RequiredArgsConstructor
public class MemberController {
    @Autowired
    IMemberService memberService = new MemberService();

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public MemberResponseDto create(@Valid @RequestBody MemberRequestDto memberRequest) {
        return memberService.create(memberRequest);
    }

    @PutMapping("/update-status/{id}")
    @ResponseStatus(HttpStatus.OK)
    public MemberResponseDto updateStatus(@Valid @RequestBody MemberRequestDto memberRequest, @PathVariable Long id) {
        return memberService.updateStatus(memberRequest, id);
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

    @GetMapping("/current/{projectId}")
    @ResponseStatus(HttpStatus.OK)
    public MemberResponseDto getCurrentOne(@PathVariable Long projectId) {
        return memberService.getCurrentOne(projectId);
    }


    @PostMapping("/page/by-project/{projectId}")
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<MemberResponseDto> getPageByProject(
            @RequestBody SearchParamRequestDto searchParam,
            @PathVariable Long projectId
    ) {
        return memberService.getListPageByProject(searchParam, projectId);
    }

    @PostMapping("/invite-list")
    @ResponseStatus(HttpStatus.OK)
    public List<MemberResponseDto> inviteListMember(
            @RequestBody MemberInviteRequestDto memberInviteRequestDto
    ) throws MessagingException {
        return memberService.inviteList(memberInviteRequestDto);
    }

    @GetMapping("/own-invitation")
    @ResponseStatus(HttpStatus.OK)
    public List<MemberDetailResponseDto> ownInvitation() {
        return memberService.getOwnInvitation();
    }

    @PutMapping("/accept-invite/{memberId}")
    @ResponseStatus(HttpStatus.OK)
    public CustomResponse acceptInvite(@PathVariable Long memberId) {
        return memberService.acceptInvite(memberId);
    }

    @PostMapping("/page/by-workspace/{workspaceId}")
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<MemberResponseDto> getPageByWorkspace(
            @RequestBody SearchParamRequestDto searchParam,
            @PathVariable Long workspaceId
    ) {
        return memberService.getListPageByWorkspace(searchParam, workspaceId);
    }
}
