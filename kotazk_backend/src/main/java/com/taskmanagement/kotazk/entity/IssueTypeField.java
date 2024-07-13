package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.CategoryField;
import com.taskmanagement.kotazk.entity.enums.FieldType;
import com.taskmanagement.kotazk.entity.enums.Visibility;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "issue_type_field")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class IssueTypeField {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "system_initial", nullable = false)
    private Boolean systemInitial;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "order")
    private Long order;

    @Column(name = "required")
    private Boolean required;

    @Column(name = "default_value")
    private String defaultValue;

    @Column(name = "hide_when_empty")
    private Boolean hideWhenEmpty;

    @Enumerated(EnumType.STRING)
    @Column(name = "category_field", nullable = false)
    private CategoryField categoryField;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private FieldType type;
}
