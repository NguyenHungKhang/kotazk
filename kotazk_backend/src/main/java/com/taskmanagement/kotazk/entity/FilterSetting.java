package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.FilterField;
import com.taskmanagement.kotazk.entity.enums.FilterOperator;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

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

    @Enumerated(EnumType.STRING)
    @JoinColumn(name = "field_name", nullable = false)
    private FilterField field;

    @ElementCollection
    @CollectionTable(name = "value_list", joinColumns = @JoinColumn(name = "filter_setting_id"))
    @Column(name = "value")
    private List<String> values;

    @Enumerated(EnumType.STRING)
    @Column(name = "operator", nullable = false)
    private FilterOperator operator;
}
