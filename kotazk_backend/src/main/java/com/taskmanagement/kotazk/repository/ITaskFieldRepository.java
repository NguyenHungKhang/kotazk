package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.TaskField;
import com.taskmanagement.kotazk.entity.WorkSpace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ITaskFieldRepository extends JpaRepository<TaskField, Long> {
}
