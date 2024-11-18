package com.taskmanagement.kotazk.payload.request.sortSetting;

import com.taskmanagement.kotazk.entity.enums.SortField;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class SortSettingRequestDto {
    Long sectionId;
    SortField field;
    Boolean asc;
}
