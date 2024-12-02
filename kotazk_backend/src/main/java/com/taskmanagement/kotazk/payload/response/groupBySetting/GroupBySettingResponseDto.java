package com.taskmanagement.kotazk.payload.response.groupBySetting;

import com.taskmanagement.kotazk.entity.enums.GroupByField;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class GroupBySettingResponseDto {
    Long sectionId;
    GroupByField field;
}
