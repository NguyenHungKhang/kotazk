package com.taskmanagement.kotazk.payload.request.member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class MemberInviteItemRequestDto {
    Long id;
    String email;
}
