package com.taskmanagement.kotazk.payload.request.attachment;

import com.taskmanagement.kotazk.entity.Folder;
import com.taskmanagement.kotazk.entity.Setting;
import com.taskmanagement.kotazk.entity.Task;
import com.taskmanagement.kotazk.entity.TaskComment;
import com.taskmanagement.kotazk.entity.enums.AttachmentType;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.Set;

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
