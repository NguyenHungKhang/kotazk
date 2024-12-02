export const setCurrentGroupByEntity = (groupByEntity) => ({type: 'SET_CURRENT_GROUPBY_ENTITY', payload: groupByEntity});
export const initialCurrentGroupByEntity = (groupByEntity) => ({type: 'INITIAL_CURRENT_GROUPBY_ENTITY', payload: groupByEntity});
export const clearCurrentGroupByEntity = () => ({type: 'CLEAR_CURRENT_GROUPBY_ENTITY'});