package com.taskmanagement.kotazk.payload.response.projectReport;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ProjectReportItemResponseDto {
    String name;
    Map<String, Object> additionalFields = new HashMap<>();
}
