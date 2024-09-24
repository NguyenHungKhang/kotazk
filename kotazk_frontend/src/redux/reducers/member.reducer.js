const initialState = {
    currentProjectMemberList: null,
}

const MemberReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_PROJECT_MEMBER_LIST':
            return {
                ...state,
                currentProjectMemberList: action.payload
            };
        default:
            return state;
    }
}

export default MemberReducer;