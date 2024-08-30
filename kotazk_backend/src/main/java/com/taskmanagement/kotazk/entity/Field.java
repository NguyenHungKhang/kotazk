package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.NatureField;
import com.taskmanagement.kotazk.entity.enums.FieldType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "field")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Field {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "system_initial", nullable = false)
    private Boolean systemInitial;

    @Column(name = "system_required", nullable = false)
    private Boolean systemRequired;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "default_value")
    private String defaultValue;

    @Column(name = "is_required", nullable = false)
    private Boolean isRequired;

    @Column(name = "is_multiple_choice", nullable = false)
    private Boolean isMultipleChoice;

    @Column(name = "is_hide_when_empty", nullable = false)
    private Boolean isHideWhenEmpty;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private FieldType type;

    @Column(name = "position", nullable = false)
    private Long position;

    @OneToMany(mappedBy = "field", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position")
    private List<FieldOption> fieldOptions;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}
