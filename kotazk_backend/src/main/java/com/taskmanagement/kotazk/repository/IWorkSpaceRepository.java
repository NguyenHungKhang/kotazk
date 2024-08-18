package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.User;
import com.taskmanagement.kotazk.entity.WorkSpace;
import com.taskmanagement.kotazk.entity.enums.WorkSpacePermission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IWorkSpaceRepository extends JpaRepository<WorkSpace, Long>, JpaSpecificationExecutor<WorkSpace> {
    Optional<WorkSpace> findByKey(String key);
}
