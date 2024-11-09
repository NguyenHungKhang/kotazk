export const setCurrentKanbanTaskList = (store) => ({type: 'SET_CURRENT_KANBAN_TASK_LIST', payload: store});
export const setCurrentTaskList = (taskList) => ({type: 'SET_CURRENT_TASK_LIST', payload: taskList});
export const setCurrentGroupedTaskList = (groupedTaskList) => ({type: 'SET_CURRENT_GROUPED_TASK_LIST', payload: groupedTaskList});
export const addAndUpdateTaskList = (task) => ({type: 'ADD_OR_UPDATE_TASK_OF_TASK_LIST', payload: task});
export const addAndUpdateGroupedTaskList = (task) => ({type: 'ADD_OR_UPDATE_TASK_OF_GROUPED_TASK_LIST', payload: task});
export const removeItemTaskList = (taskId) => ({type: 'REMOVE_TASK_OF_TASK_LIST', payload: taskId});
export const removeItemGroupedTaskList = (taskId) => ({type: 'REMOVE_TASK_OF_GROUPED_TASK_LIST', payload: taskId});