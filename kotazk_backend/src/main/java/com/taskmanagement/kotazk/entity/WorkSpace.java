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

    @OneToOne
    @JoinColumn(name = "customization_id")
    private Customization customization;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "key", unique = true, nullable = false)
    private String key;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", nullable = false)
    private Visibility visibility;

    @Enumerated(EnumType.STRING)
    @Column(name = "space_status", nullable = false)
    private WorkSpaceStatus status;

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
    private List<Section> sections;

    @OneToMany(mappedBy = "workSpace", cascade = CascadeType.ALL)
    private List<ActivityLog> activityLogs;

    @OneToMany(mappedBy = "workSpace", cascade = CascadeType.ALL)
    private Set<Setting> settings;

    @Column(name = "archive_at")
    private Timestamp archivedAt;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}

