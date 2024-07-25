package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.Rule;
import com.taskmanagement.kotazk.entity.User;
import jakarta.validation.constraints.Email;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IRuleRepository extends JpaRepository<Rule, Long>  {
}
