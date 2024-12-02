package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.GroupByField;
import com.taskmanagement.kotazk.entity.enums.SortField;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sort_setting")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SortSetting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "section_id", unique = false, nullable = false)
    private Section section;

    @Enumerated(EnumType.STRING)
    @JoinColumn(name = "field", nullable = false)
    private SortField field;

    @Column(name = "asc", nullable = false)
    private Boolean asc;
}
