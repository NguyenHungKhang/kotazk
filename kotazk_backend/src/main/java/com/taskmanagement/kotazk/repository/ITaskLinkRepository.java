package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.TaskLink;
import com.taskmanagement.kotazk.entity.WorkSpace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ITaskLinkRepository extends JpaRepository<TaskLink, Long>, JpaSpecificationExecutor<TaskLink> {
    @Query("SELECT t FROM TaskLink t WHERE (t.firstTask = :task1 AND t.secondTask = :task2) OR (t.firstTask = :task2 AND t.secondTask = :task1)")
    Optional<TaskLink> findFirstByTasksWithSwap(@Param("task1") Long task1, @Param("task2") Long task2);

}