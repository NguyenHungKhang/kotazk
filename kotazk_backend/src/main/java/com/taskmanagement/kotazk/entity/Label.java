package com.taskmanagement.kotazk.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "label")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Label {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name; // Tên nhãn

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt; // Thời gian tạo

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt; // Thời gian cập nhật
}
