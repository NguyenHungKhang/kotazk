import WorkspaceReducer from "./workspace.reducer";
import ProjectReducer from "./project.reducer";
import TaskReducer from "./task.reducer";
import StatusReducer from "./status.reducer";
import TaskTypeReducer from "./taskType.reducer";
import DialogReducer from "./dialog.reducer";
import PriorityReducer from "./priority.reducer";
import LabelReducer from "./label.reducer";
import MemberReducer from "./member.reducer";
import SnackbarReducer from "./snackbar.reducer";
import FilterReducer from "./filter.reducer";
import { combineReducers } from 'redux'

const allReducers = {
    workspace: WorkspaceReducer,
    project: ProjectReducer,
    task: TaskReducer,
    status: StatusReducer,
    taskType: TaskTypeReducer,
    dialog: DialogReducer,
    priority: PriorityReducer,
    label: LabelReducer,
    member: MemberReducer,
    snackbar: SnackbarReducer,
    filter: FilterReducer
}

const rootReducer = combineReducers(allReducers);
export default rootReducer;