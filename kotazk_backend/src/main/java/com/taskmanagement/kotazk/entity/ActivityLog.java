package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.ActivityLogType;
import com.taskmanagement.kotazk.entity.enums.SectionType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.Set;

@Entity
@Table(name = "activity_log")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "work_space_id")
    private WorkSpace workSpace;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Goal

    // Sprint

    @Column(name = "system_initial", nullable = false)
    private Boolean systemInitial;

    @Column(name = "system_required", nullable = false)
    private Boolean systemRequired;

    @Column(name = "content")
    private String content;

    @Column(name = "first_parameter", nullable = false)
    private String firstParameter;

    @Column(name = "secondParameter", nullable = false)
    private String secondParameter;

    @Column(name = "first_url", nullable = false)
    private String firstUrl;

    @Column(name = "second_url", nullable = false)
    private String secondUrl;

    @Column(name = "first_entity", nullable = false)
    private String firstEntity;

    @Column(name = "second_entity", nullable = false)
    private String secondEntity;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ActivityLogType type;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}
