import { updateAndAddArray, updateOrAddGroupedTasks } from "../../utils/arrayUtil";

const initialState = {
    currentTaskList: null,
    currentGroupedTaskList: null,
    currentGroupedEntity: null,
    isGroupedList: false, 
};

const TaskReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_TASK_LIST':
            return {
                ...state,
                currentTaskList: action.payload,
                currentGroupedTaskList: null,
                currentGroupedEntity: null,
                    isGroupedList: false, 
            };
        case 'SET_CURRENT_GROUPED_TASK_LIST':
            return {
                ...state,
                currentTaskList: null,
                currentGroupedTaskList: action.payload.list,
                currentGroupedEntity: action.payload.groupedEntity ?? state.currentGroupedEntity,
                isGroupedList: true, 
            };

        case 'ADD_OR_UPDATE_TASK_OF_GROUPED_TASK_LIST':
            return {
                ...state,
                currentGroupedTaskList: updateOrAddGroupedTasks(state.currentGroupedTaskList, action.payload),
            };

        case 'ADD_OR_UPDATE_TASK_OF_TASK_LIST':
            return {
                ...state,
                currentTaskList: updateAndAddArray(state.currentTaskList, [action.payload]),
            };
        default:
            return state;
    }
};

export default TaskReducer;
