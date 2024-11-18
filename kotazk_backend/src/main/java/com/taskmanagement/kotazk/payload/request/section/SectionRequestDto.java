package com.taskmanagement.kotazk.payload.request.section;

import com.taskmanagement.kotazk.entity.FilterSetting;
import com.taskmanagement.kotazk.entity.enums.SectionType;
import com.taskmanagement.kotazk.payload.request.customization.CustomizationRequestDto;
import com.taskmanagement.kotazk.payload.request.filterSetting.FilterSettingRequestDto;
import com.taskmanagement.kotazk.payload.request.groupBySetting.GroupBySettingRequestDto;
import com.taskmanagement.kotazk.payload.request.sortSetting.SortSettingRequestDto;
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
public class SectionRequestDto {
    String name;
    String description;
    Long workSpaceId;
    Long projectId;
    CustomizationRequestDto customization;
    Long position;
    SectionType type;
    List<FilterSettingRequestDto> filterSettings;
    GroupBySettingRequestDto groupBySetting;
    SortSettingRequestDto sortSetting;
}
