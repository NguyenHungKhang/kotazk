import { removeItemById, updateAndAddArray } from "../../utils/arrayUtil";

const initialState = {
    currentTaskCommentList: null,
}

const TaskCommentReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_TASK_COMMENT_LIST':
            return {
                ...state,
                currentTaskCommentList: action.payload
            };
        case 'ADD_OR_UPDATE_TASK_COMMENT_LIST':
            return {
                ...state,
                currentTaskCommentList: updateAndAddArray(state.currentTaskCommentList, [action.payload]),
            };
        case 'REMOVE_TASK_COMMENT_LIST':
            return {
                ...state,
                currentTaskCommentList: removeItemById(state.currentTaskCommentList, action.payload),
            };
        default:
            return state;
    }
}

export default TaskCommentReducer;