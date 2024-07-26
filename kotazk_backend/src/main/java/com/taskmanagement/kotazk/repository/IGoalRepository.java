package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.Goal;
import com.taskmanagement.kotazk.entity.WorkSpace;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IGoalRepository extends JpaRepository<Goal, Long> {
}
