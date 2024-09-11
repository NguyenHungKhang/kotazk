const initialState = {
    currentKanbanTaskList: null,
}

const TaskReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_KANBAN_TASK_LIST':
            return {
                ...state,
                currentKanbanTaskList: action.payload
            };
        default:
            return state;
    }
}

export default TaskReducer;