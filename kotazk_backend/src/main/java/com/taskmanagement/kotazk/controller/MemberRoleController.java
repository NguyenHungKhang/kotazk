package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.memberrole.MemberRoleRequestDto;
import com.taskmanagement.kotazk.payload.request.memberrole.RepositionMemberRoleRequestDto;
import com.taskmanagement.kotazk.payload.request.workspace.WorkSpaceRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.memberrole.MemberRoleResponseDto;
import com.taskmanagement.kotazk.payload.response.workspace.WorkSpaceDetailResponseDto;
import com.taskmanagement.kotazk.service.IMemberRoleService;
import com.taskmanagement.kotazk.service.IWorkSpaceService;
import com.taskmanagement.kotazk.service.impl.MemberRoleService;
import com.taskmanagement.kotazk.service.impl.WorkSpaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/member-role")
public class MemberRoleController {
    @Autowired
    IMemberRoleService memberRoleService = new MemberRoleService();

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public MemberRoleResponseDto create(@Valid @RequestBody MemberRoleRequestDto memberRoleRequest) {
        return memberRoleService.create(memberRoleRequest, false);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public MemberRoleResponseDto update(@Valid @RequestBody MemberRoleRequestDto memberRoleRequest, @PathVariable Long id) {
        return memberRoleService.update(id, memberRoleRequest);
    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean delete(@PathVariable Long id) {
        return memberRoleService.delete(id);
    }

    @PatchMapping("/soft/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean softDelete(@PathVariable Long id) throws IOException, InterruptedException {
        return memberRoleService.softDelete(id);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public MemberRoleResponseDto getOne(@PathVariable Long id) {
        return memberRoleService.getOne(id);
    }

    @PostMapping("/page")
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<MemberRoleResponseDto> search(
            @RequestParam(required = false) Long workspaceId,
            @RequestParam(required = false) Long projectId,
            @RequestBody SearchParamRequestDto searchParam) {
        return memberRoleService.getListPage(searchParam, workspaceId, projectId);
    }

    @PostMapping("/re-position")
    @ResponseStatus(HttpStatus.OK)
    public Boolean rePosition(@Valid @RequestBody RepositionMemberRoleRequestDto repositionMemberRole) {
        return memberRoleService.rePosition(repositionMemberRole);
    }
}
