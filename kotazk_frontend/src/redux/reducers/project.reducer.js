const initialState = {
    currentProjectList: null,
    currentProject: null
}

const ProjectReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_PROJECT_LIST':
            return {
                ...state,
                currentProjectList: action.payload
            };
        case 'SET_CURRENT_PROJECT':
            return {
                ...state,
                currentProject: action.payload
            };
        default:
            return state;
    }
}

export default ProjectReducer;