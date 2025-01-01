package com.taskmanagement.kotazk.payload.request.attachment;

import com.taskmanagement.kotazk.entity.enums.AttachmentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AttachmentRequestDto {
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
