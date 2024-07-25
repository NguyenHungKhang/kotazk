package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.SpaceRole;
import com.taskmanagement.kotazk.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ISpaceRoleRepository extends JpaRepository<SpaceRole, Long> {
}
