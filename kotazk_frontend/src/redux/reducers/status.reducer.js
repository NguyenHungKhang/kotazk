const initialState = {
    currentStatusList: null,
}

const StatusReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_STATUS_LIST':
            return {
                ...state,
                currentStatusList: action.payload
            };
        default:
            return state;
    }
}

export default StatusReducer;