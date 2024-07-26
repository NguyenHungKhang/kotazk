package com.taskmanagement.kotazk.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.Set;

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

    @ManyToOne
    @JoinColumn(name = "to_status_id", nullable = false)
    private Status toStatus;

    @Column(name = "system_initial", nullable = false)
    private Boolean systemInitial;

    @Column(name = "system_required", nullable = false)
    private Boolean systemRequired;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "transition", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Rule> rules;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}