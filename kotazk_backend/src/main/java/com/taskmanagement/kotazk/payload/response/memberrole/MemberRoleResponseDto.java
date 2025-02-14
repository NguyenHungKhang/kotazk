package com.taskmanagement.kotazk.payload.response.memberrole;

import com.taskmanagement.kotazk.entity.enums.EntityBelongsTo;
import com.taskmanagement.kotazk.entity.enums.ProjectPermission;
import com.taskmanagement.kotazk.entity.enums.WorkSpacePermission;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class MemberRoleResponseDto {
    Long id;
    Long workSpaceId;
    Long projectId;
    Boolean systemInitial;
    Boolean systemRequired;
    String name;
    String description;
    Long position;
    EntityBelongsTo roleFor;
    Set<WorkSpacePermission> workSpacePermissions = new HashSet<>();
    Set<ProjectPermission> projectPermissions = new HashSet<>();
    Timestamp createdAt;
    Timestamp updatedAt;
    Timestamp deletedAt;
}
