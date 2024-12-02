package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.GroupByField;
import com.taskmanagement.kotazk.entity.enums.MemberStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "group_by_setting")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class GroupBySetting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "section_id", unique = false, nullable = false)
    private Section section;

    @Enumerated(EnumType.STRING)
    @JoinColumn(name = "field", nullable = false)
    private GroupByField field;
}
