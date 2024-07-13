package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.CategoryField;
import com.taskmanagement.kotazk.entity.enums.FieldType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "issue_type_field_option")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class IssueTypeFieldOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "value", nullable = false)
    private String value;

    @Column(name = "description")
    private String description;

    @Column(name = "order")
    private Long order;

    @Column(name = "required")
    private Boolean required;

    @Column(name = "default_value")
    private Boolean defaultValue;
}
