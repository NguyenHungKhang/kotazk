package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.Member;
import com.taskmanagement.kotazk.entity.MemberRole;
import com.taskmanagement.kotazk.entity.WorkSpace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IMemberRepository extends JpaRepository<Member, Long>, JpaSpecificationExecutor<Member> {
    @Query("SELECT m FROM Member m WHERE m.user.id = :userId AND " +
            "(:projectId IS NULL OR m.project.id = :projectId) AND " +
            "(:workSpaceId IS NULL OR m.workSpace.id = :workSpaceId)")
    Optional<Member> findByUserAndProjectOrWorkSpace(@Param("userId") Long userId,
                                                     @Param("projectId") Long projectId,
                                                     @Param("workSpaceId") Long workSpaceId);

    @Query("SELECT m FROM Member m WHERE m.email = :email")
    List<Member> findByEmail(@Param("email") String email);
}
