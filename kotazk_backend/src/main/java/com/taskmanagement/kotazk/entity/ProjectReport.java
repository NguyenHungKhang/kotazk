package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "project_report")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProjectReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "workspace_id")
    private WorkSpace workspace;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "color_mode")
    private ProjectColorModeReport colorMode;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ProjectReportType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "x_type")
    private ProjectXTypeReport xType;

    @Enumerated(EnumType.STRING)
    @Column(name = "sub_x_type")
    private ProjectSubXTypeReport subXType;

    @Enumerated(EnumType.STRING)
    @Column(name = "grouped_by")
    private ProjectGroupByReport groupedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "y_type")
    private ProjectYTypeReport yType;

    @Column(name = "from_when")
    private Timestamp fromWhen;

    @Column(name = "to_when")
    private Timestamp toWhen;

    @Column(name = "between")
    private Long between;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}
