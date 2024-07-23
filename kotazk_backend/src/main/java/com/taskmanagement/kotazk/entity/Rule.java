package com.taskmanagement.kotazk.entity;


import com.taskmanagement.kotazk.entity.enums.ConditionRule;
import com.taskmanagement.kotazk.entity.enums.PostFunctionRule;
import com.taskmanagement.kotazk.entity.enums.ValidatorRule;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "rule")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Rule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "transition_id", nullable = false)
    private Transition transition;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_rule")
    private ConditionRule conditionRule;

    @Enumerated(EnumType.STRING)
    @Column(name = "validator_rule")
    private ValidatorRule validatorRule;

    @Enumerated(EnumType.STRING)
    @Column(name = "post_function_rule")
    private PostFunctionRule postFunctionRule;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}