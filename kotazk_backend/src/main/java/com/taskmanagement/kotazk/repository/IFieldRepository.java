package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.Field;
import com.taskmanagement.kotazk.entity.WorkSpace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface IFieldRepository extends JpaRepository<Field, Long>, JpaSpecificationExecutor<Field> {
}
