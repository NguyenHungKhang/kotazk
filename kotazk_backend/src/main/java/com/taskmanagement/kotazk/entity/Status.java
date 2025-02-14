package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.Permission;
import com.taskmanagement.kotazk.entity.enums.StatusType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "status")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Status {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "customization_id")
    private Customization customization;

    @Column(name = "is_from_any", nullable = false)
    private Boolean isFromAny = true;

    @Column(name = "is_from_start", nullable = false)
    private Boolean isFromStart = false;

    @Column(name = "system_initial", nullable = false)
    private Boolean systemInitial = false;

    @Column(name = "system_required", nullable = false)
    private Boolean systemRequired = false;

    @Column(name = "position", nullable = false)
    private Long position;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "is_completed_status", nullable = false)
    private Boolean isCompletedStatus;

    @OneToMany(mappedBy = "status", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
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
