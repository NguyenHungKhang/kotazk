package com.taskmanagement.kotazk.payload.request.attachment;

import com.taskmanagement.kotazk.entity.Folder;
import com.taskmanagement.kotazk.entity.Setting;
import com.taskmanagement.kotazk.entity.Task;
import com.taskmanagement.kotazk.entity.TaskComment;
import com.taskmanagement.kotazk.entity.enums.AttachmentType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.Set;

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
