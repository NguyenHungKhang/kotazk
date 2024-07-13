package com.taskmanagement.kotazk.entity;

import com.taskmanagement.kotazk.entity.enums.Permission;
import com.taskmanagement.kotazk.entity.enums.StatusType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "status")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Status {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private StatusType type;
}
