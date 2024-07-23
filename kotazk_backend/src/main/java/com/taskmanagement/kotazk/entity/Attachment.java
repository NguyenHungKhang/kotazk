package com.taskmanagement.kotazk.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

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

    @Column(name = "file_name", nullable = false)
    private String fileName; // Tên tệp đính kèm

    @Column(name = "file_type", nullable = false)
    private String fileType; // Loại tệp (ví dụ: image/png, application/pdf)

    @Column(name = "file_url", nullable = false)
    private String fileUrl; // Dữ liệu tệp đính kèm

    @Column(name = "position", nullable = false)
    private Boolean position;

    @ManyToOne
    @JoinColumn(name = "project_member_id", nullable = false)
    private ProjectMember projectMember;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne
    @JoinColumn(name = "task_comment_id", nullable = false)
    private TaskComment taskComment; // Liên kết với bình luận

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}