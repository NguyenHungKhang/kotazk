package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.TaskTypeFieldOption;
import com.taskmanagement.kotazk.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ITaskTypeFieldOptionRepository extends JpaRepository<TaskTypeFieldOption, Long> {
}
