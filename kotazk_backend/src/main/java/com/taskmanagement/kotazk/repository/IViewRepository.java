package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.User;
import com.taskmanagement.kotazk.entity.View;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IViewRepository extends JpaRepository<View, Long>  {
}
