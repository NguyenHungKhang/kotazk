package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.MemberStatus;
import com.taskmanagement.kotazk.entity.enums.EntityBelongsTo;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "member")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "work_space_id")
    private WorkSpace workSpace;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(name = "system_initial", nullable = false)
    private Boolean systemInitial;

    @Column(name = "system_required", nullable = false)
    private Boolean systemRequired;

    @Column(name = "email")
    private String email;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MemberStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "member_for", nullable = false)
    private EntityBelongsTo memberFor;

    @ManyToOne
    @JoinColumn(name = "member_role_id", nullable = false)
    private MemberRole role;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ActivityLog> activityLogs;

    @OneToMany(mappedBy = "assignee")
    private List<Task> assigneeTasks;

    @OneToMany(mappedBy = "creator")
    private List<Task> creatorTasks;

    @OneToMany(mappedBy = "member")
    private List<Attachment> attachment;

    @CreationTimestamp
    @Column(name = "joined_at")
    private Timestamp joinedAt;

    @PreRemove
    public void removeTasks() {
        if (this.assigneeTasks != null) {
            // Iterate through the list of tasks and set their assignee to null
            for (Task task : this.assigneeTasks) {
                task.setAssignee(null); // Remove the association with the assignee
            }
        }

        if (this.creatorTasks != null) {
            // Iterate through the list of tasks and set their assignee to null
            for (Task task : this.creatorTasks) {
                task.setCreator(null); // Remove the association with the assignee
            }
        }
    }

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt; // Thời gian tạo

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt; // Thời gian cập nhật

    @Column(name = "deleted_at")
    private Timestamp deletedAt; // Thời gian xóa (nế
}