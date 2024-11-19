import { TroubleshootRounded } from "@mui/icons-material";

const initialState = {
    currentGroupByEntity: 'status',
    isSystemEntity: true,
    userChangeGroupByEntity: false,
}

const GroupByReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_GROUPBY_ENTITY':
            return {
                ...state,
                currentGroupByEntity: action.payload.currentGroupByEntity ?? "status",
                isSystemEntity: true,
                userChangeGroupByEntity: true
            };
        case 'INITIAL_CURRENT_GROUPBY_ENTITY':
            return {
                ...state,
                currentGroupByEntity: action.payload.currentGroupByEntity ?? "status",
                isSystemEntity: true,
                userChangeGroupByEntity: false
            };
        case 'CLEAR_CURRENT_GROUPBY_ENTITY':
            return {
                ...state,
                currentGroupByEntity: null,
                isSystemEntity: null,
            };
        default:
            return state;
    }
}

export default GroupByReducer;