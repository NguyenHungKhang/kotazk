package com.taskmanagement.kotazk.payload.request.tasktype;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TaskTypeRequestDto {
    Long projectId;
    String name;
    String description;
}
