package com.taskmanagement.kotazk.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "issue_data")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class IssueData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "issue_id", nullable = false)
    private Issue issue;

    @ManyToOne
    @JoinColumn(name = "issue_type_id", nullable = false)
    private IssueType issueType;

    @Column(name = "order",nullable = false)
    private Long order; //

    @Column(name = "value", nullable = false)
    private String value; // Giá trị cụ thể cho loại vấn đề

    // Getters and Setters
}
