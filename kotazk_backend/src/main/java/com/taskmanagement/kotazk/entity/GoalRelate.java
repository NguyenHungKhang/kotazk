package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.GoalDueType;
import com.taskmanagement.kotazk.entity.enums.GoalRelateType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "goal_relate")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class GoalRelate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @ManyToOne
//    @JoinColumn(name = "user_id", nullable = false)
//    private User user;

    @ManyToOne
    @JoinColumn(name = "goal_id", nullable = false)
    private Goal goal;

    @Column(name = "position", nullable = false)
    private Long position;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private GoalRelateType type;

    @Column(name = "specific_id", nullable = false)
    private Long specific_id;

//    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL, orphanRemoval = true)
//    private Set<Setting> settings;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}
