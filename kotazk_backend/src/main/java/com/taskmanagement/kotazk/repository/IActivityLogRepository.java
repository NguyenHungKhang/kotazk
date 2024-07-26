package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.ActivityLog;
import com.taskmanagement.kotazk.entity.Field;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IActivityLogRepository extends JpaRepository<ActivityLog, Long> {
}
