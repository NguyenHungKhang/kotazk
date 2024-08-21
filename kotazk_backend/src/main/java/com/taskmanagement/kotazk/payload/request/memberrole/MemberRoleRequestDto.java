package com.taskmanagement.kotazk.payload.request.memberrole;

import com.taskmanagement.kotazk.entity.WorkSpace;
import com.taskmanagement.kotazk.entity.enums.EntityBelongsTo;
import com.taskmanagement.kotazk.entity.enums.ProjectPermission;
import com.taskmanagement.kotazk.entity.enums.WorkSpacePermission;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.EnumSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class MemberRoleRequestDto {
    Long workSpaceId;
    Long projectId;
    String name;
    String description;
    Set<WorkSpacePermission> workSpacePermissions;
    Set<ProjectPermission> projectPermissions;
    EntityBelongsTo roleFor;
}
