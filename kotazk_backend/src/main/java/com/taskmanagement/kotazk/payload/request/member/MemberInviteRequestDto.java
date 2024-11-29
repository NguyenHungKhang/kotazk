package com.taskmanagement.kotazk.payload.request.member;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class MemberInviteRequestDto {
    Long projectId = 0L;
    Long workspaceId = 0L;
    @NotNull
    Long memberRoleId;
    Set<MemberInviteItemRequestDto> items = new HashSet<>();
}
