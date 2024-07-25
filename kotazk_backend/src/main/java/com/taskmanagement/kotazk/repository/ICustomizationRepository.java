package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.Customization;
import com.taskmanagement.kotazk.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICustomizationRepository extends JpaRepository<Customization, Long>  {
}
