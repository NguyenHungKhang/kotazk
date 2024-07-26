package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.FilterOperator;
import com.taskmanagement.kotazk.entity.enums.Visibility;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "filter_setting")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FilterSetting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;

    @ManyToOne
    @JoinColumn(name = "field_id", nullable = false)
    private Field field;

    @Column(name = "first_value", nullable = false)
    private String firstValue;

    @Column(name = "second_value", nullable = false)
    private String secondValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "operator", nullable = false)
    private FilterOperator operator;
}
