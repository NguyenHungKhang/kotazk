package com.taskmanagement.kotazk.payload.request.workspace;

import com.taskmanagement.kotazk.entity.enums.Visibility;
import com.taskmanagement.kotazk.entity.enums.WorkSpaceStatus;
import com.taskmanagement.kotazk.payload.request.customization.CustomizationRequestDto;
import com.taskmanagement.kotazk.payload.request.setting.SettingRequestDto;
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
public class WorkSpaceRequestDto {
    Long userId;
    CustomizationRequestDto customization;
    String name;
    String description;
    Visibility visibility;
    WorkSpaceStatus status;
    Set<SettingRequestDto> settings = new HashSet<>();
}
