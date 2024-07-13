package com.taskmanagement.kotazk.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "issue_type")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class IssueType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;
}
