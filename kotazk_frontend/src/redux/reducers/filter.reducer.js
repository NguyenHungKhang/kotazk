const initialState = {
    currentFilterList: null,
    userChangeFilterList: false,
}

const FilterReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_FILTER_LIST':
            return {
                ...state,
                currentFilterList: action.payload,
                userChangeFilterList: true
            };
        case 'INITIAL_CURRENT_FILTER_LIST':
            return {
                ...state,
                currentFilterList: action.payload,
                userChangeFilterList: false
            };
        default:
            return state;
    }
}

export default FilterReducer;