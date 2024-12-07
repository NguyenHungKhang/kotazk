package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.MemberRole;
import com.taskmanagement.kotazk.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface INotificationRepository extends JpaRepository<Notification, Long>, JpaSpecificationExecutor<Notification> {
}
