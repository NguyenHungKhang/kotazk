import WorkspaceReducer from "./workspace.reducer";
import ProjectReducer from "./project.reducer";
import TaskReducer from "./task.reducer";
import StatusReducer from "./status.reducer";
import TaskTypeReducer from "./taskType.reducer";
import DialogReducer from "./dialog.reducer";
import { combineReducers } from 'redux'

const allReducers = {
    workspace: WorkspaceReducer,
    project: ProjectReducer,
    task: TaskReducer,
    status: StatusReducer,
    taskType: TaskTypeReducer,
    dialog: DialogReducer
}

const rootReducer = combineReducers(allReducers);
export default rootReducer;