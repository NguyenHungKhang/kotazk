package com.taskmanagement.kotazk.payload.response.attachment;

import com.taskmanagement.kotazk.entity.enums.AttachmentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AttachmentResponseDto {
    Long id;
    Long taskId;
    Long taskCommentId;
    String fileName;
    String fileType;
    String fileSize;
    String fileUrl;
    Long position;
    Boolean isHidden;
    AttachmentType type;
}
