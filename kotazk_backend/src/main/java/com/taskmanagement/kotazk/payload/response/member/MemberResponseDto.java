package com.taskmanagement.kotazk.payload.response.member;

import com.taskmanagement.kotazk.entity.MemberRole;
import com.taskmanagement.kotazk.entity.Project;
import com.taskmanagement.kotazk.entity.User;
import com.taskmanagement.kotazk.entity.WorkSpace;
import com.taskmanagement.kotazk.entity.enums.EntityBelongsTo;
import com.taskmanagement.kotazk.entity.enums.MemberStatus;
import com.taskmanagement.kotazk.payload.response.memberrole.MemberRoleResponseDto;
import com.taskmanagement.kotazk.payload.response.memberrole.MemberRoleSummaryResponseDto;
import com.taskmanagement.kotazk.payload.response.user.UserResponseDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class MemberResponseDto {
    Long id;
    Long workSpaceId;
    Long projectId;
    String email;
    UserResponseDto user;
    MemberStatus status;
    EntityBelongsTo memberFor;
    MemberRoleResponseDto role;
}
