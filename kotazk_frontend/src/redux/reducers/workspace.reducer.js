const initialState = {
    currentWorkspace: null,
}

const WorkspaceReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_WORKSPACE':
            return {
                ...state,
                currentWorkspace: action.payload
            };
        default:
            return state;
    }
}

export default WorkspaceReducer;