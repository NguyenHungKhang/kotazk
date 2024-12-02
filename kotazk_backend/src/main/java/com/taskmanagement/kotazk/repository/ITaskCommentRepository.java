package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.Task;
import com.taskmanagement.kotazk.entity.TaskComment;
import com.taskmanagement.kotazk.entity.WorkSpace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ITaskCommentRepository extends JpaRepository<TaskComment, Long>, JpaSpecificationExecutor<TaskComment> {
}
