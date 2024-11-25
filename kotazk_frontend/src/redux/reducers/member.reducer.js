const initialState = {
    currentUserMember: null,
    currentProjectMemberList: null,
}

const MemberReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_PROJECT_MEMBER_LIST':
            return {
                ...state,
                currentProjectMemberList: action.payload
            };
        case 'SET_CURRENT_USER_MEMBER':
            return {
                ...state,
                currentUserMember: action.payload
            };
        default:
            return state;
    }
}

export default MemberReducer;