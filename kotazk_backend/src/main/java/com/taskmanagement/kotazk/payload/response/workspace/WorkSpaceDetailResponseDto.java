package com.taskmanagement.kotazk.payload.response.workspace;

import com.taskmanagement.kotazk.entity.Customization;
import com.taskmanagement.kotazk.entity.enums.Visibility;
import com.taskmanagement.kotazk.entity.enums.WorkSpaceStatus;
import com.taskmanagement.kotazk.payload.request.customization.CustomizationRequestDto;
import com.taskmanagement.kotazk.payload.response.member.MemberResponseDto;
import com.taskmanagement.kotazk.payload.response.user.UserResponseDto;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class WorkSpaceDetailResponseDto {
    Long id;
    String name;
    CustomizationRequestDto customization;
    UserResponseDto user;
    String description;
    String key;
    Visibility visibility;
    WorkSpaceStatus status;
}
