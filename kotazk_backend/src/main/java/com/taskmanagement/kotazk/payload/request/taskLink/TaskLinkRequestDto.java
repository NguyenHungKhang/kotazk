package com.taskmanagement.kotazk.payload.request.taskLink;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TaskLinkRequestDto {
    Long firstTaskId;
    Long secondTaskId;
}
