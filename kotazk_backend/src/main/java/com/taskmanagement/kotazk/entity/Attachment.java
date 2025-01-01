package com.taskmanagement.kotazk.entity;


import com.taskmanagement.kotazk.entity.enums.AttachmentType;
import com.taskmanagement.kotazk.entity.enums.ProjectStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.Set;

@Entity
@Table(name = "attachment")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Attachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = true)
    private Member member;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne
    @JoinColumn(name = "task_comment_id")
    private TaskComment taskComment;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_type", nullable = false)
    private String fileType;

    @Column(name = "file_size")
    private String fileSize;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @Column(name = "position", nullable = false)
    private Long position;

    @Column(name = "is_hidden", nullable = false)
    private Boolean isHidden;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private AttachmentType type;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}