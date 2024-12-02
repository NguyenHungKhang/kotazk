const initialState = {
    currentSortEntity: null,
    currentSortDirection: "ascending",
    userChangeSortEntity: false,
}

const SortReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_SORT_ENTITY':
            return {
                ...state,
                currentSortEntity: action.payload.entity,
                currentSortDirection: action.payload.asc,
                userChangeSortEntity: true
            };
        case 'INITIAL_CURRENT_SORT_ENTITY':
            return {
                ...state,
                currentSortEntity: action.payload.entity,
                currentSortDirection: action.payload.asc,
                userChangeSortEntity: false
            };
        default:
            return state;
    }
}

export default SortReducer;