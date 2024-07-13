package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.Permission;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

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
    @Column(name = "permission", nullable = false)
    private Permission permission;

    @CreationTimestamp
    @Column(name = "joined_at")
    private Timestamp joinedAt; // Thời gian tham gia
}