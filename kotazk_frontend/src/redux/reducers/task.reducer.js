const initialState = {
    currentTaskList: null,
}

const TaskReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_TASK_LIST':
            return {
                ...state,
                currentTaskList: action.payload
            };
        default:
            return state;
    }
}

export default TaskReducer;