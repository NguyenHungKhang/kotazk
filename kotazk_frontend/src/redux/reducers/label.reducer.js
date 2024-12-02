const initialState = {
    currentLabelList: null,
    showLabel: false
}

const LabelReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_LABEL_LIST':
            return {
                ...state,
                currentLabelList: action.payload
            };
        case 'SET_SHOW_LABEL':
            return {
                ...state,
                showLabel: action.payload
            };
        default:
            return state;
    }
}

export default LabelReducer;