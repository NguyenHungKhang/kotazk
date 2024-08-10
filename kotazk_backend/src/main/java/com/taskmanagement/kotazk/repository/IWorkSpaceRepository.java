package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.User;
import com.taskmanagement.kotazk.entity.WorkSpace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IWorkSpaceRepository extends JpaRepository<WorkSpace, Long>, JpaSpecificationExecutor<WorkSpace> {
    Optional<WorkSpace> findByKey(String key);
}
