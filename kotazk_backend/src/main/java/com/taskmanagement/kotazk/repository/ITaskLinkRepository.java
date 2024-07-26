package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.TaskLink;
import com.taskmanagement.kotazk.entity.WorkSpace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ITaskLinkRepository extends JpaRepository<TaskLink, Long> {
}
