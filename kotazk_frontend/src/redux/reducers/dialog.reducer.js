import { fas } from "@fortawesome/free-solid-svg-icons";

const initialState = {
    taskDialog: {
        task: null,
        parentTask: null,
        open: false
    },
    addTaskDialog: {
        open: false,
        props: null,
    },
    fullReportDialog: {
        open: false,
        props: null,
    },
    projectReportDialog: {
        open: false,
        props: null,
    },
    deleteDialog: {
        open: false,
        content: null,
        title: null,
        deleteType: null,
        deleteProps: null
    },    
    alertDialog: {
        open: false,
        type: null,
        props: null,
    },
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
                    props: action.payload.props
                }
            };
        case 'SET_FULL_REPORT_DIALOG':
            return {
                ...state,
                fullReportDialog: {
                    open: action.payload.open != null ? action.payload.open : state.fullReportDialog.open,
                    props: action.payload.props
                }
            };
        case 'SET_ADD_AND_UPDATE_PROJECT_REPORT':
            return {
                ...state,
                projectReportDialog: {
                    open: action.payload.open != null ? action.payload.open : state.projectReportDialog.open,
                    props: action.payload.props
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
            case 'SET_ALERT_DIALOG':
                return {
                    ...state,
                    alertDialog: {
                        open: action.payload.open != null ? action.payload.open : state.deleteDialog.open,
                        type: action.payload.type,
                        props: action.payload.props
                    },
                };
        default:
            return state;
    }
};

export default DialogReducer;
