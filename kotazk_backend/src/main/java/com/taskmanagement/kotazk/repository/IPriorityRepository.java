package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface IPriorityRepository  extends JpaRepository<Priority, Long>, JpaSpecificationExecutor<Priority> {
}
