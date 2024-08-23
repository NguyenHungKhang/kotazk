package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.Section;
import com.taskmanagement.kotazk.entity.WorkSpace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ISectionRepository extends JpaRepository<Section, Long>, JpaSpecificationExecutor<Section> {
}
