package com.taskmanagement.kotazk.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "task")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "space_id", nullable = false)
    private Space space; // Không gian chứa dự án

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project; // Dự án chứa nhiệm vụ

    @Column(name = "position", nullable = false)
    private Long position;

    @ManyToOne
    @JoinColumn(name = "parent_task_id") // Chỉ định là nhiệm vụ cha
    private Task parentTask; // Nhiệm vụ cha

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "task_type_id", nullable = false)
    private TaskType taskType;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}

