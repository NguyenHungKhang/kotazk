const initialState = {
    currentSectionList: null,
    currentSection: null
}

const SectionReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SECTION_LIST':
            return {
                ...state,
                currentSectionList: action.payload
            };
        case 'SET_SECTION':
            return {
                ...state,
                currentSection: action.payload
            };
        default:
            return state;
    }
}

export default SectionReducer;