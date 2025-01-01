const initialState = {
    currentUserMember: null,
    currentProjectMemberFetched: false,
    currentWorkspaceMember: null,
    currentWorkspaceMemberFetched: false,
    currentProjectMemberList: null,
    currentWorkspaceMemberList: null
}

const MemberReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_PROJECT_MEMBER_LIST':
            return {
                ...state,
                currentProjectMemberList: action.payload,
            };
        case 'SET_CURRENT_USER_MEMBER':
            return {
                ...state,
                currentUserMember: action.payload,
                currentProjectMemberFetched: true,
            };
        case 'SET_CURRENT_WORKSPACE_MEMBER':
            return {
                ...state,
                currentWorkspaceMember: action.payload,
                currentWorkspaceMemberFetched: true
            };
        default:
            return state;
    }
}

export default MemberReducer;