const initialState = {
    currentWorkspaceList: null,
    currentWorkspace: null,
    currentFetchedIdWorkspace: false
}

const WorkspaceReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_WORKSPACE':
            return {
                ...state,
                currentWorkspace: action.payload,
                currentFetchedIdWorkspace: action.payload?.id
            };
        case 'SET_CURRENT_WORKSPACE_LIST':
            return {
                ...state,
                currentWorkspaceList: action.payload
            };
        default:
            return state;
    }
}

export default WorkspaceReducer;