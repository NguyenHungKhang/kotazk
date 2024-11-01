import { fas } from "@fortawesome/free-solid-svg-icons";

const initialState = {
    taskDialog: {
        task: null,
        parentTask: null,
        open: false
    },
    addTaskDialog: {
        open: false,
    },
    deleteDialog: {
        open: false,
        content: null,
        title: null,
        deleteType: null,
        deleteProps: null
    }
};

const DialogReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TASK_DIALOG':
            return {
                ...state,
                taskDialog: {
                    task: action.payload.task != null ? action.payload.task : state.taskDialog.task,
                    parentTask: action.payload.parentTask != null ? action.payload.parentTask : state.taskDialog.parentTask,
                    open: action.payload.open != null ? action.payload.open : state.taskDialog.open,
                }
            };
        case 'SET_ADD_TASK_DIALOG':
            return {
                ...state,
                addTaskDialog: {
                    open: action.payload.open != null ? action.payload.open : state.addTaskDialog.open,
                }
            };
        case 'SET_DELETE_DIALOG':
            return {
                ...state,
                deleteDialog: {
                    open: action.payload.open != null ? action.payload.open : state.deleteDialog.open,
                    content: action.payload.content != null ? action.payload.content : state.deleteDialog.content,
                    title: action.payload.title != null ? action.payload.title : state.deleteDialog.title,
                    deleteType: action.payload.deleteType != null ? action.payload.deleteType : state.deleteDialog.deleteType,
                    deleteProps: action.payload.deleteProps != null ? action.payload.deleteProps : state.deleteDialog.deleteProps,
                }
            };
        default:
            return state;
    }
};

export default DialogReducer;
