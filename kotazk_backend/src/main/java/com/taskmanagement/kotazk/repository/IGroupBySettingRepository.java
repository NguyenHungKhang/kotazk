package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.GroupBySetting;
import com.taskmanagement.kotazk.entity.WorkSpace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IGroupBySettingRepository extends JpaRepository<GroupBySetting, Long> {
}
