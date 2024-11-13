package com.taskmanagement.kotazk.controller;

import com.taskmanagement.kotazk.payload.request.common.RePositionRequestDto;
import com.taskmanagement.kotazk.payload.request.common.SearchParamRequestDto;
import com.taskmanagement.kotazk.payload.request.memberrole.MemberRoleRequestDto;
import com.taskmanagement.kotazk.payload.request.memberrole.RepositionMemberRoleRequestDto;
import com.taskmanagement.kotazk.payload.request.workspace.WorkSpaceRequestDto;
import com.taskmanagement.kotazk.payload.response.common.PageResponse;
import com.taskmanagement.kotazk.payload.response.common.RePositionResponseDto;
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

import static com.taskmanagement.kotazk.config.ConstantConfig.DEFAULT_ENDPOINT_SECURE_PART;

@RestController
@RequestMapping(DEFAULT_ENDPOINT_SECURE_PART + "/member-role")
public class MemberRoleController {
    @Autowired
    IMemberRoleService memberRoleService = new MemberRoleService();

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public MemberRoleResponseDto create(@Valid @RequestBody MemberRoleRequestDto memberRoleRequest) {
        return memberRoleService.create(memberRoleRequest);
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

    @PostMapping("/page/by-project/{projectId}")
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<MemberRoleResponseDto> search(
            @RequestBody SearchParamRequestDto searchParam,
            @PathVariable Long projectId

    ) {
        return memberRoleService.getPageByProject(searchParam, projectId);
    }

    @PostMapping("/re-position/by-project/{projectId}")
    @ResponseStatus(HttpStatus.OK)
    public MemberRoleResponseDto rePositionByProject(@Valid @RequestBody RePositionRequestDto rePositionRequestDto, @PathVariable Long projectId) {
        return memberRoleService.rePositionByProject(rePositionRequestDto, projectId);
    }

    @PostMapping("/re-position/by-workspace/{workspaceId}")
    @ResponseStatus(HttpStatus.OK)
    public RePositionResponseDto rePositionByWorkspace(@Valid @RequestBody RePositionRequestDto rePositionRequestDto, @PathVariable Long workspaceId) {
        return memberRoleService.rePositionByWorkspace(rePositionRequestDto, workspaceId);
    }
}
