package com.taskmanagement.kotazk.payload.response.project;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ProjectSummaryResponseDto {
    Long id;
    String name;
    Boolean isPinned;
    Long position;
}
