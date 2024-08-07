package com.taskmanagement.kotazk.payload.request.member;

import com.taskmanagement.kotazk.entity.enums.EntityBelongsTo;
import com.taskmanagement.kotazk.entity.enums.MemberStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class MemberRequestDto {
    Long workSpaceId;
    Long projectId;
    Boolean systemInitial;
    Boolean systemRequired;
    Long userId;
    MemberStatus status;
    EntityBelongsTo memberFor;
    Long roleId;
}
