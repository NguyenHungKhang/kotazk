export const setCurrentTaskCommentList = (taskCommentList) => ({type: 'SET_CURRENT_TASK_COMMENT_LIST', payload: taskCommentList});
export const addAndUpdateTaskCommentList = (taskComment) => ({type: 'ADD_OR_UPDATE_TASK_COMMENT_LIST', payload: taskComment});
export const removeItemTaskCommentList = (taskCommentId) => ({type: 'REMOVE_TASK_COMMENT_LIST', payload: taskCommentId});