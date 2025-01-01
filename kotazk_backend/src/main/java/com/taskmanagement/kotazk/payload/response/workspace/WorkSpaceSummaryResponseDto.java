package com.taskmanagement.kotazk.payload.response.workspace;

import com.taskmanagement.kotazk.entity.enums.Visibility;
import com.taskmanagement.kotazk.entity.enums.WorkSpaceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class WorkSpaceSummaryResponseDto {
    Long id;
    String name;
    String description;
    String key;
}
