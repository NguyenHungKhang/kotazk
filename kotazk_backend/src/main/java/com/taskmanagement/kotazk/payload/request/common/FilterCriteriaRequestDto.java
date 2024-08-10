package com.taskmanagement.kotazk.payload.request.common;

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
public class FilterCriteriaRequestDto {
    private String key;
    private FilterOperator operation;
    private String value;
    private List<String> values;
}