import WorkspaceReducer from "./workspace.reducer";
import { combineReducers } from 'redux'

const allReducers = {
    workspace: WorkspaceReducer
}

const rootReducer = combineReducers(allReducers);
export default rootReducer;