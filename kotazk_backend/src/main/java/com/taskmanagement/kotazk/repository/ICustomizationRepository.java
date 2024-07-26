package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.Customization;
import com.taskmanagement.kotazk.entity.Field;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ICustomizationRepository extends JpaRepository<Customization, Long> {
}
