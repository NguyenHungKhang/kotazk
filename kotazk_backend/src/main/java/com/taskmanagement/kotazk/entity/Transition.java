package com.taskmanagement.kotazk.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "transition")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Transition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "from_status_id", nullable = false)
    private Status fromStatus;

    @Column(name = "is_from_any", nullable = false)
    private Boolean isFromAny = true;

    @Column(name = "is_from_start", nullable = false)
    private Boolean isFromStart = false;

    @ManyToOne
    @JoinColumn(name = "to_status_id", nullable = false)
    private Status toStatus;

    @Column(name = "description")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}