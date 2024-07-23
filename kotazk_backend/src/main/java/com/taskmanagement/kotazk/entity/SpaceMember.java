package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.MemberStatus;
import com.taskmanagement.kotazk.entity.enums.Permission;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.lang.reflect.Member;
import java.sql.Timestamp;

@Entity
@Table(name = "space_member")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SpaceMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "space_id", nullable = false)
    private Space space; // Không gian

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Người dùng

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MemberStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "permission", nullable = false)
    private Permission permission;

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