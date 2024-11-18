package com.taskmanagement.kotazk.payload.request.filterSetting;

import com.taskmanagement.kotazk.entity.Section;
import com.taskmanagement.kotazk.entity.enums.FilterField;
import com.taskmanagement.kotazk.entity.enums.FilterOperator;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class FilterSettingRequestDto {
    Long sectionId;
    FilterField field;
    List<String> values;
    FilterOperator operator;
}
