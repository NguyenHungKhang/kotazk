package com.taskmanagement.kotazk.service.impl;

import com.taskmanagement.kotazk.entity.Status;
import com.taskmanagement.kotazk.entity.TaskType;
import com.taskmanagement.kotazk.service.ITaskTypeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TaskTypeService implements ITaskTypeService {
    @Override
    public List<TaskType> initialTaskType() {
        return List.of(
                createDefaultInitialTaskType("Task", "", 0L),
                createDefaultInitialTaskType("Subtask", "", 1L),
                createDefaultInitialTaskType("Milestone", "", 2L)
        );
    }

    // Utility Functions

    private TaskType createDefaultInitialTaskType(
            String name,
            String description,
            Long position
    ) {
        return TaskType.builder()
                .name(name)
                .description(description)
                .position(position)
                .systemInitial(true)
                .systemRequired(true)
                .build();
    }

}
