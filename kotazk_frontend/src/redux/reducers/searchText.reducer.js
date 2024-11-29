const initialState = {
    taskSearchText: "",
}

const SearchTextReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TASK_SEARCH_TEXT':
            return {
                ...state,
                taskSearchText: action.payload,
            };
        case 'INITIAL_CURRENT_SORT_ENTITY':
        default:
            return state;
    }
}

export default SearchTextReducer;