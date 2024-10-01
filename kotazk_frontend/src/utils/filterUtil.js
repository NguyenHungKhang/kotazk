// Utility method for applying filters to tasks
export const applyTaskFilters = (tasks, filters) => {
    // Return tasks if filters are null or undefined
    if (!filters || filters?.length == 0) return tasks;
    console.log(123);
    return tasks.filter((task) => {
        return filters.every((filter) => {
            if (!filter.active) return true; // Skip inactive filters

            const taskFieldValue = getTaskFieldValue(task, filter.key);

            console.log(taskFieldValue)

            // Apply filtering based on the operation
            switch (filter.operation) {
                case 'EQUAL':
                    return taskFieldValue === filter.value;
                case 'NOT EQUAL':
                    return taskFieldValue !== filter.value;
                default:
                    return true;
            }
        });
    });
};

// Helper function to dynamically get task field value based on key
const getTaskFieldValue = (task, key) => {
    switch (key) {
        case 'status.id':
            return task.statusId;
        case 'priority.id':
            return task.priorityId;
        case 'assignee.id':
            return task.assigneeId;
        default:
            return undefined;
    }
};
