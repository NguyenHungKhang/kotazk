package com.taskmanagement.kotazk.payload.response.memberrole;

import com.taskmanagement.kotazk.entity.Project;
import com.taskmanagement.kotazk.entity.WorkSpace;
import com.taskmanagement.kotazk.entity.enums.EntityBelongsTo;
import com.taskmanagement.kotazk.entity.enums.ProjectPermission;
import com.taskmanagement.kotazk.entity.enums.WorkSpacePermission;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class MemberRoleSummaryResponseDto {
    Long id;
    Long workSpaceId;
    Long projectId;
    Boolean systemInitial;
    Boolean systemRequired;
    String name;
    String description;
    Long position;
    EntityBelongsTo roleFor;
    Timestamp createdAt;
    Timestamp updatedAt;
    Timestamp deletedAt;
}
