package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.MemberStatus;
import com.taskmanagement.kotazk.entity.enums.Permission;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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

    @Column(name = "project_role_id", nullable = false)
    private ProjectRole projectRole;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MemberStatus status;

    @CreationTimestamp
    @Column(name = "joined_at")
    private Timestamp joinedAt; // Thời gian tham gia

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt; // Thời gian tạo

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt; // Thời gian cập nhật

    @Column(name = "deleted_at")
    private Timestamp deletedAt; // Thời gian xóa (nế
}
