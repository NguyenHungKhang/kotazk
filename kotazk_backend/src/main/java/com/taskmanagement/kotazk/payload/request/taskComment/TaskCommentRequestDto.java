package com.taskmanagement.kotazk.payload.request.taskComment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TaskCommentRequestDto {
    Long taskId;
    Long memberId;
    Long userId;
    String content;
}
