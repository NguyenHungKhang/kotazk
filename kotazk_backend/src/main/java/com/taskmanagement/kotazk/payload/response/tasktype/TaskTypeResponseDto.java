package com.taskmanagement.kotazk.payload.response.tasktype;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TaskTypeResponseDto {
    Long projectId;
    String name;
    String description;
}
