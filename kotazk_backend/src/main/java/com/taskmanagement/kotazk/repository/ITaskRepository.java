package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.Project;
import com.taskmanagement.kotazk.entity.Task;
import com.taskmanagement.kotazk.entity.WorkSpace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ITaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
}
