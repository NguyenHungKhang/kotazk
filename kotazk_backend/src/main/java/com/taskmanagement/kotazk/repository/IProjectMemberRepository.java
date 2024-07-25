package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IProjectMemberRepository extends JpaRepository<ProjectMember, Long>  {
}
