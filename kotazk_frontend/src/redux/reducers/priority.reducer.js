const initialState = {
    currentPriorityList: null,
}

const PriorityReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_PRIORITY_LIST':
            return {
                ...state,
                currentPriorityList: action.payload
            };
        default:
            return state;
    }
}

export default PriorityReducer;