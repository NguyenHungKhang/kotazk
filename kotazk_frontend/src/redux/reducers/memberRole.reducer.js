const initialState = {
    currentMemberRoleList: null,
}

const MemberRoleReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_MEMBER_ROLE_LIST':
            return {
                ...state,
                currentMemberRoleList: action.payload
            };
        case 'DELETE_MEMBER_ROLE':
            return {
                ...state,
                currentMemberRoleList: state.currentMemberRoleList.filter(mr => mr.id != action.payload)
            };
        default:
            return state;
    }
}

export default MemberRoleReducer;