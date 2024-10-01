const initialState = {
    currentFilterList: null,
}

const FilterReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_FILTER_LIST':
            return {
                ...state,
                currentFilterList: action.payload
            };
        default:
            return state;
    }
}

export default FilterReducer;