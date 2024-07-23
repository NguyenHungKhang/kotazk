package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.CategoryField;
import com.taskmanagement.kotazk.entity.enums.FieldType;
import com.taskmanagement.kotazk.entity.enums.Visibility;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "task_type_field")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TaskTypeField {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "task_type_id", nullable = false)
    private TaskType taskTypeId;

    @Column(name = "system_initial", nullable = false)
    private Boolean systemInitial;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "order")
    private Long order;

    @Column(name = "required")
    private Boolean required;

    @Column(name = "default_value")
    private String defaultValue;

    @Column(name = "hide_when_empty")
    private Boolean hideWhenEmpty;

    @Enumerated(EnumType.STRING)
    @Column(name = "category_field", nullable = false)
    private CategoryField categoryField;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private FieldType type;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}
