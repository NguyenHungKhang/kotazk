package com.taskmanagement.kotazk.payload.response.section;

import com.taskmanagement.kotazk.entity.enums.SectionType;
import com.taskmanagement.kotazk.payload.request.customization.CustomizationRequestDto;
import com.taskmanagement.kotazk.payload.request.filterSetting.FilterSettingRequestDto;
import com.taskmanagement.kotazk.payload.request.groupBySetting.GroupBySettingRequestDto;
import com.taskmanagement.kotazk.payload.request.sortSetting.SortSettingRequestDto;
import com.taskmanagement.kotazk.payload.response.filterSetting.FilterSettingResponseDto;
import com.taskmanagement.kotazk.payload.response.groupBySetting.GroupBySettingResponseDto;
import com.taskmanagement.kotazk.payload.response.sortSetting.SortSettingResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class SectionResponseDto {
    Long id;
    String name;
    String description;
    Long workSpaceId;
    Long projectId;
    CustomizationRequestDto customization;
    Long position;
    SectionType type;
    List<FilterSettingResponseDto> filterSettings = new ArrayList<>();
    GroupBySettingResponseDto groupBySetting;
    SortSettingResponseDto sortSetting;
}
