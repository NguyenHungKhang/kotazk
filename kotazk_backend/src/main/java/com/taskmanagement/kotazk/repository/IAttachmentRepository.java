package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.Attachment;
import com.taskmanagement.kotazk.entity.Field;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IAttachmentRepository extends JpaRepository<Attachment, Long> {
}
