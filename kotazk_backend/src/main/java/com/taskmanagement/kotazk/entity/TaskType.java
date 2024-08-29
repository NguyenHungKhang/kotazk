package com.taskmanagement.kotazk.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "task_type")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TaskType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "customization_id")
    private Customization customization;

    @Builder.Default
    @Column(name = "system_initial", nullable = false)
    private Boolean systemInitial;

    @Builder.Default
    @Column(name = "system_required", nullable = false)
    private Boolean systemRequired;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "position", nullable = false)
    private Long position;

    @OneToMany(mappedBy = "taskType", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position")
    private List<Task> tasks;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}
