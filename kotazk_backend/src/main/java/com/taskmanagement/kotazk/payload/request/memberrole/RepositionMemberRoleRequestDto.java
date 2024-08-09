package com.taskmanagement.kotazk.payload.request.memberrole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class RepositionMemberRoleRequestDto {
    Long roleId;
    Long newPosition;
    Long workspaceId;
    Long projectId;
}
