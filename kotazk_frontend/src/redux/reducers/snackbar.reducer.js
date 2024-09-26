const initialState = {
    snackbar: {
        content: null,
        type: null,
        open: false
    },
};

const SnackbarReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SNACKBAR':
            return {
                ...state,
                snackbar: {
                    content: action.payload.content != null ? action.payload.content : state.snackbar.content,
                    open: action.payload.open != null ? action.payload.open : state.snackbar.open,
                    type: action.payload.type != null ? action.payload.type : state.snackbar.type,
                }
            };
        default:
            return state;
    }
};

export default SnackbarReducer;
