const initialState = {
    currentTaskTypeList: null,
}

const TaskTypeReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_TASK_TYPE_LIST':
            return {
                ...state,
                currentTaskTypeList: action.payload
            };
        default:
            return state;
    }
}

export default TaskTypeReducer;