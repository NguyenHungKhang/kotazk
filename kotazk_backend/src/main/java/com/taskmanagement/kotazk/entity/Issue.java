package com.taskmanagement.kotazk.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "issue")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Issue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "issue_type_id", nullable = false)
    private IssueType issue_type_id;
}
