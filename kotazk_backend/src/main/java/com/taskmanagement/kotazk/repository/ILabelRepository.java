package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.Label;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ILabelRepository extends JpaRepository<Label, Long>, JpaSpecificationExecutor<Label> {
}

