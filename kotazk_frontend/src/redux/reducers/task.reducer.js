const initialState = {
    currentTaskList: null,
    currentGroupedTaskList: null,
    currentGroupedEntity: null
}

const TaskReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_TASK_LIST':
            return {
                ...state,
                currentTaskList: action.payload,
                currentGroupedTaskList: null,
                currentGroupedEntity: null
            };
        case 'SET_CURRENT_GROUPED_TASK_LIST':
            return {
                ...state,
                currentTaskList: null,
                currentGroupedTaskList: action.payload.list,
                currentGroupedEntity: action.payload.groupedEntity
            };
        default:
            return state;
    }
}

export default TaskReducer;