import { updateAndAddArray } from "../../utils/arrayUtil";

const initialState = {
    currentProjecReportList: null,
}

const ProjectReportReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PROJECT_REPORTS_LIST':
            return {
                ...state,
                currentProjecReportList: action.payload
            };
        case 'DELETE_PROJECT_REPORT':
            return {
                ...state,
                currentProjecReportList: state.currentProjecReportList.filter(mr => mr.id != action.payload)
            };
        case 'UPDATE_PROJECT_REPORT':
            return {
                ...state,
                currentProjecReportList: updateAndAddArray(state.currentProjecReportList, [action.payload]),
            };
        default:
            return state;
    }
}

export default ProjectReportReducer;