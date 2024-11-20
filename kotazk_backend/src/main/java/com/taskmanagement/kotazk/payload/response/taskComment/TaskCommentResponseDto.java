package com.taskmanagement.kotazk.payload.response.taskComment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TaskCommentResponseDto {
    Long id;
    Long taskId;
    Long memberId;
    Long userId;
    String content;
}
