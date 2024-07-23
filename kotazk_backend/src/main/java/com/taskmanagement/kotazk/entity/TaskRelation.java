package com.taskmanagement.kotazk.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Table(name = "task_relation")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TaskRelation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fist_task_id", nullable = false)
    private Task firstTask;

    @ManyToOne
    @JoinColumn(name = "second_task_id", nullable = false)
    private Task secondTask;

    @ManyToOne
    @JoinColumn(name = "task_type_field_id", nullable = false)
    private TaskTypeField taskTypeField;

    @Column(name = "value_1", nullable = false)
    private String value1;

    @Column(name = "value_2", nullable = false)
    private String value2;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}
