package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.ProjectReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface IProjectReportRepository extends JpaRepository<ProjectReport, Long>, JpaSpecificationExecutor<ProjectReport> {
}
