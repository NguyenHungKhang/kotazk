package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.ProjectStatus;
import com.taskmanagement.kotazk.entity.enums.Visibility;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "project")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "work_space_id", nullable = false)
    private WorkSpace workSpace;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "cover")
    private String cover;

    @Column(name = "name", nullable = false)
    private String name;

    @Builder.Default
    @Column(name = "is_pinned", nullable = false)
    private Boolean isPinned = false;

    @Column(name = "position", nullable = false)
    private Long position;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private ProjectStatus status = ProjectStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", nullable = false)
    private Visibility visibility;

    @Column(name = "key", nullable = false, unique = true)
    private String key;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position")
    private List<MemberRole> memberRoles;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
//    @OrderBy("role.position, name")
    private List<Member> members;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position")
    private List<Task> tasks;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position")
    private List<Status> statuses;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position")
    private List<Section> sections;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position")
    private List<TaskType> taskTypes;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position")
    private List<ActivityLog> activityLogs;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position")
    private List<Priority> priorities;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("name")
    private List<Label> labels;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;

    @Column(name = "archive_at")
    private Timestamp archiveAt;
}
