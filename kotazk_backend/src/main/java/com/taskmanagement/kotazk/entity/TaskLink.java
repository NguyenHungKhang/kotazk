package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.StatusType;
import com.taskmanagement.kotazk.entity.enums.TaskLinkRelationship;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Table(name = "task_link")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TaskLink {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fist_task_id", nullable = false)
    private Task firstTask;

    @ManyToOne
    @JoinColumn(name = "second_task_id", nullable = false)
    private Task secondTask;

    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "first_task_relationship", nullable = false)
    private TaskLinkRelationship firstTaskRelationship;

    @Enumerated(EnumType.STRING)
    @Column(name = "second_task_relationship", nullable = false)
    private TaskLinkRelationship secondTaskRelationship;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}
