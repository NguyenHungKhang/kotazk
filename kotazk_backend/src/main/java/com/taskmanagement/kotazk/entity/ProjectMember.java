package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.Permission;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "project_members")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProjectMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project; // Dự án

    @ManyToOne
    @JoinColumn(name = "space_member_id", nullable = false)
    private SpaceMember spaceMember; // Thành viên của không gian

    @Enumerated(EnumType.STRING)
    @Column(name = "permission", nullable = false)
    private Permission permission;

    @CreationTimestamp
    @Column(name = "joined_at")
    private Timestamp joinedAt; // Thời gian tham gia
}
