package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.EntityBelongsTo;
import com.taskmanagement.kotazk.entity.enums.ProjectPermission;
import com.taskmanagement.kotazk.entity.enums.WorkSpacePermission;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.Set;

@Table(name = "member_role")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MemberRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "space_id", nullable = false)
    private WorkSpace space;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(name = "system_initial", nullable = false)
    private Boolean systemInitial;

    @Column(name = "system_required", nullable = false)
    private Boolean systemRequired;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @ElementCollection(targetClass = WorkSpacePermission.class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "work_space_permissions", joinColumns = @JoinColumn(name = "work_space_id"))
    @Column(name = "permission")
    private Set<WorkSpacePermission> spacePermissions;

    @ElementCollection(targetClass = ProjectPermission.class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "project_permissions", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "permission")
    private Set<ProjectPermission> projectPermissions;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_for", nullable = false)
    private EntityBelongsTo role_for;

    @OneToOne(mappedBy = "role", fetch = FetchType.LAZY)
    private Member member;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}
