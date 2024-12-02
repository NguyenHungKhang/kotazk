package com.taskmanagement.kotazk.payload.response.filterSetting;

import com.taskmanagement.kotazk.entity.enums.FilterField;
import com.taskmanagement.kotazk.entity.enums.FilterOperator;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class FilterSettingResponseDto {
    Long id;
    Long sectionId;
    FilterField field;
    List<String> values;
    FilterOperator operator;
}