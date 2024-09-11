import WorkspaceReducer from "./workspace.reducer";
import ProjectReducer from "./project.reducer";
import TaskReducer from "./task.reducer";
import { combineReducers } from 'redux'

const allReducers = {
    workspace: WorkspaceReducer,
    project: ProjectReducer,
    task: TaskReducer
}

const rootReducer = combineReducers(allReducers);
export default rootReducer;