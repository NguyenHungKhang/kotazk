package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.Kanban;
import com.taskmanagement.kotazk.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IKanbanRepository extends JpaRepository<Kanban, Long>  {
}
