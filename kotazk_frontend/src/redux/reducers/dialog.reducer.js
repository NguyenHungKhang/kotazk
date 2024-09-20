const initialState = {
    taskDialog: {
        task: null,
        open: false
    },
};

const DialogReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TASK_DIALOG':
            return {
                ...state,
                taskDialog: {
                    task: action.payload.task != null ? action.payload.task : state.taskDialog.task,
                    open: action.payload.open != null ? action.payload.open : state.taskDialog.open,
                }
            };
        default:
            return state;
    }
};

export default DialogReducer;
