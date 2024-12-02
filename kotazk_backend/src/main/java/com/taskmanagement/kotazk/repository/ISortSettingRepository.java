package com.taskmanagement.kotazk.repository;

import com.taskmanagement.kotazk.entity.SortSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ISortSettingRepository  extends JpaRepository<SortSetting, Long>, JpaSpecificationExecutor<SortSetting> {
}
