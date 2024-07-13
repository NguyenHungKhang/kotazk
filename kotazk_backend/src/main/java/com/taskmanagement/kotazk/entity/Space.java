package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.SpaceStatus;
import com.taskmanagement.kotazk.entity.enums.Visibility;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
@Entity
@Table(name = "spaces")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Space {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Người tạo không gian

    @Column(name = "name", nullable = false)
    private String name; // Tên không gian

    @Column(name = "description")
    private String description; // Mô tả không gian

    @Column(name = "archive_at")
    private Timestamp archiveAt; // Thời gian lưu trữ

    @Column(name = "space_key", unique = true, nullable = false)
    private String spaceKey; // Khóa không gian, duy nhất cho mỗi không gian

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", nullable = false)
    private Visibility visibility; // Trạng thái visibility (PUBLIC, PRIVATE, LIMITED)

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt; // Thời gian tạo

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt; // Thời gian cập nhật

    @Column(name = "deleted_at")
    private Timestamp deletedAt; // Thời gian xóa (nếu có)
}

