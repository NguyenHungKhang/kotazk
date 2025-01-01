package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.Visibility;
import com.taskmanagement.kotazk.entity.enums.WorkSpaceStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "work_space")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class WorkSpace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "cover")
    private String cover;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", length = 65535)
    @Lob
    private String description;

    @Column(name = "key", unique = true, nullable = false)
    private String key;

    @OneToMany(mappedBy = "workSpace", cascade = CascadeType.ALL)
    @OrderBy("position")
    private Set<MemberRole> memberRoles;

    @OneToMany(mappedBy = "workSpace", cascade = CascadeType.ALL)
//    @OrderBy("role.position, name")
    private List<Member> members;

    @OneToMany(mappedBy = "workSpace", cascade = CascadeType.ALL)
    private Set<Task> tasks;

    @OneToMany(mappedBy = "workSpace", cascade = CascadeType.ALL)
    @OrderBy("position")
    private List<Project> projects;

    @OneToMany(mappedBy = "workSpace", cascade = CascadeType.ALL)
    private List<ActivityLog> activityLogs;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}

