package com.taskmanagement.kotazk.payload.request.groupBySetting;

import com.taskmanagement.kotazk.entity.enums.FilterField;
import com.taskmanagement.kotazk.entity.enums.GroupByField;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class GroupBySettingRequestDto {
    Long sectionId;
    GroupByField field;
}
