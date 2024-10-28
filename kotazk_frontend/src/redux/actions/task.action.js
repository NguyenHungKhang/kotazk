export const setCurrentKanbanTaskList = (store) => ({type: 'SET_CURRENT_KANBAN_TASK_LIST', payload: store});
export const setCurrentTaskList = (taskList) => ({type: 'SET_CURRENT_TASK_LIST', payload: taskList});
export const setCurrentGroupedTaskList = (groupedTaskList) => ({type: 'SET_CURRENT_GROUPED_TASK_LIST', payload: groupedTaskList});