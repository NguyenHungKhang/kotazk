package com.taskmanagement.kotazk.payload.response.projectReport;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ProjectReportItemNameAndColorResponseDto {
    String name;
    String color;
}
