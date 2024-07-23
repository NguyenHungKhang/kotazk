package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.SpacePermission;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.Set;

@Table(name = "space_role")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SpaceRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "space_id", nullable = false)
    private Space space;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @ManyToMany
    @JoinTable(
            name = "space_role_permissions",
            joinColumns = @JoinColumn(name = "space_role_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<SpacePermission> permissions;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}
