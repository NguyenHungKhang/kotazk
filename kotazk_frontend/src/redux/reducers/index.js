import WorkspaceReducer from "./workspace.reducer";
import ProjectReducer from "./project.reducer";
import { combineReducers } from 'redux'

const allReducers = {
    workspace: WorkspaceReducer,
    project: ProjectReducer
}

const rootReducer = combineReducers(allReducers);
export default rootReducer;