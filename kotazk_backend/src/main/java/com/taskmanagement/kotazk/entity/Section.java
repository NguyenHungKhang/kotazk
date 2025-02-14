package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.EntityBelongsTo;
import com.taskmanagement.kotazk.entity.enums.SectionType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "section")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Section {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "customization_id")
    private Customization customization;

    @OneToOne(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
    private SortSetting sortSetting;

    @OneToOne(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
    private GroupBySetting groupBySetting;

    @Column(name = "system_initial", nullable = false)
    private Boolean systemInitial;

    @Column(name = "system_required", nullable = false)
    private Boolean systemRequired;

    @Column(name = "position", nullable = false)
    private Long position;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private SectionType type;

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectReport> projectReports;

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FilterSetting> filterSettings;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}
