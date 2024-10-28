const initialState = {
    currentGroupByEntity: 'status',
    isSystemEntity: true,
    idCustomEntity: null,
}

const GroupByReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CURRENT_GROUPBY_ENTITY':
            return {
                ...state,
                currentGroupByEntity: action.payload.currentGroupByEntity,
                isSystemEntity: action.payload.isSystemEntity,
                idCustomEntity: action.payload.idCustomEntity,
            };
        case 'CLEAR_CURRENT_GROUPBY_ENTITY':
            return {
                ...state,
                currentGroupByEntity: null,
                isSystemEntity: null,
                idCustomEntity: null,
            };
        default:
            return state;
    }
}

export default GroupByReducer;