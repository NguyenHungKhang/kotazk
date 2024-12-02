package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.Field;
import com.taskmanagement.kotazk.entity.FieldOption;
import com.taskmanagement.kotazk.entity.WorkSpace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface IFieldOptionRepository extends JpaRepository<FieldOption, Long>, JpaSpecificationExecutor<FieldOption> {
}
