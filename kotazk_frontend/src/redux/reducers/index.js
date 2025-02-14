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
import GroupByReducer from "./groupBy.reducer";
import SectionReducer from "./section.reducer";
import MemberRoleReducer from "./memberRole.reducer";
import ProjectReportReducer from "./projectReport.reducer";
import SortReducer from "./sort.reducer";
import TaskCommentReducer from "./taskComment.reducer";
import SearchTextReducer from "./searchText.reducer";
import UserReducer from "./user.reducer";
import { combineReducers } from 'redux'


const allReducers = {
    user: UserReducer,
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
    filter: FilterReducer,
    groupBy: GroupByReducer,
    section: SectionReducer,
    memberRole: MemberRoleReducer,
    projectReport: ProjectReportReducer,
    sort: SortReducer,
    taskComment: TaskCommentReducer,
    searchText: SearchTextReducer
}

const rootReducer = combineReducers(allReducers);
export default rootReducer;