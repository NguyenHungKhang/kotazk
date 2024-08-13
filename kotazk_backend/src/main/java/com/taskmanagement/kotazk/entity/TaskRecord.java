package com.taskmanagement.kotazk.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.Set;

@Entity
@Table(name = "task_record")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TaskRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne
    @JoinColumn(name = "field_id", nullable = false)
    private Field field;

    @Column(name = "string_value")
    private String stringValue;

    @Column(name = "number_value")
    private Double numberValue;

    @Column(name = "time_value")
    private Timestamp timeValue;

    @ManyToMany
    @JoinTable(
            name = "task_record_select",
            joinColumns = @JoinColumn(name = "task_record_id"),
            inverseJoinColumns = @JoinColumn(name = "field_option_id")
    )
    private FieldOption selectOption;

    @ManyToMany
    @JoinTable(
            name = "task_record_checkbox",
            joinColumns = @JoinColumn(name = "task_record_id"),
            inverseJoinColumns = @JoinColumn(name = "field_option_id")
    )
    private Set<FieldOption> checkboxOptions;

    @ManyToMany
    @JoinTable(
            name = "task_record_people",
            joinColumns = @JoinColumn(name = "task_record_id"),
            inverseJoinColumns = @JoinColumn(name = "member_id")
    )
    private Set<Member> people;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}
