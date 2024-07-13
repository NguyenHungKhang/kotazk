package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.ProjectStatus;
import com.taskmanagement.kotazk.entity.enums.Visibility;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
@Entity
@Table(name = "project")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "space_id", nullable = false)
    private Space space; // Không gian chứa dự án

    @Column(name = "name", nullable = false)
    private String name; // Tên dự án

    @Column(name = "description")
    private String description; // Mô tả dự án

//    @ManyToOne
//    @JoinColumn(name = "category_id")
//    private ProjectCategory category; // Category của dự án
//
//    @ManyToOne
//    @JoinColumn(name = "team_type_id")
//    private TeamType teamType; // Loại nhóm dự án

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProjectStatus status; // Trạng thái dự án

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", nullable = false)
    private Visibility visibility;

    @Column(name = "project_key", nullable = false, unique = true)
    private String projectKey; // Mã định danh

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;

    @Column(name = "archive_at")
    private Timestamp archiveAt; // Thời gian lưu trữ
}
