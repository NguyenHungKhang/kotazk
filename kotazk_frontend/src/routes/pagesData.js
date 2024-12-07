import CustomAddWorkspaceDialog from "../components/CustomAddWorkspaceDialog";
import CustomDarkModeSwitch from "../components/CustomDarkModeSwitch";
import CustomIconPicker from "../components/CustomProjectColorIconPicker";
import CustomSaveProjectDialog from "../components/CustomSaveProjectDialog";
import CustomTaskDialog from "../components/CustomTaskDialog";
import Home from "../pages/Home";
import Kanban from "../pages/Kanban";
import Login from "../pages/Login";
import Project from "../pages/Project";
import ProjectDashBoard from "../pages/ProjectDashBoard";
import ProjectMember from "../pages/ProjectMember";
import Workspace from "../pages/WorkSpace";
import AllIconDisplay from "../playgrounds/components/AllIconDisplay";
import TestGantt from "../playgrounds/components/TestGantt";
import CustomStatusColorIconPicker from "../components/CustomStatusColorIconPicker";
import CustomTaskType from "../components/CustomTaskType";
import CustomColorIconPicker from "../components/CustomColorIconPicker";
import { taskTypeIconsList } from "../utils/iconsListUtil";
import CustomTaskTypePicker from "../components/CustomTaskTypePicker";
import CustomColorPicker from "../components/CustomColorPicker";
import ProjectSetting from "../pages/ProjectSetting";
import WorkspaceList from "../pages/WorkspaceList";
import Gantt from "../pages/Gantt";
import ProjectCalendar from "../pages/ProjectCalendar";
import ProjectList from "../pages/ProjectList";
import Section from "../pages/Section";
import ProjectRole from "../pages/ProjectRole";
import ProjectReport from "../pages/ProjectReport";
import DnDGrid from "../playgrounds/components/DndGrid";
import ListWorkspace from "../playgrounds/components/TestDnDLap";
import EmailChipInput from "../playgrounds/components/EmailChipInput";
import WorkSpaceMember from "../pages/WorkSpaceMember";
import WorkspaceDashBoard from "../pages/WorkSpaceDashBoard";
import Register from "../pages/Register";
import OtpVerification from "../pages/OtpVerification";
import ProfileSetting from "../pages/ProfileSetting";
import ForgotPassword from "../pages/ForgotPassword";

const pagesData = [
  {
    path: "",
    element: <Home />,
    title: "home"
  },
  {
    path: "/login",
    element: <Login />,
    title: "playground"
  },
  {
    path: "/register",
    element: <Register />,
    title: "playground"
  },
  {
    path: "/OtpVerification",
    element: <OtpVerification />,
    title: "playground"
  },
  {
    path: "/profile",
    element: <ProfileSetting />,
    title: "playground"
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    title: "playground"
  },
  {
    path: "/workspace",
    element: <WorkspaceList />,
    title: "workspace"
  },
  {
    path: "/workspace/:workspaceId",
    element: <Workspace ><WorkspaceDashBoard /> </Workspace>,
    title: "workspace"
  },
  {
    path: "/workspace/:workspaceId/member",
    element: <WorkSpaceMember />,
    title: "workspace"
  },
  {
    path: "/project/:projectId",
    element: <Project><ProjectDashBoard /></Project>,
    title: "project"
  },
  {
    path: "/project/:projectId/report",
    element: <Project><ProjectReport /></Project>,
    title: "Report"
  },
  {
    path: "/project/:projectId/member",
    element: <Project><ProjectMember /></Project>,
    title: "Project Member"
  },
  {
    path: "/project/:projectId/role",
    element: <Project><ProjectRole /></Project>,
    title: "Project Member"
  },
  {
    path: "/project/:projectId/section/:sectionId",
    element: <Project><Section /></Project>,
    title: "playground"
  },
  {
    path: "/project/:projectId/section/gantt",
    element: <Project><Gantt /></Project>,
    title: "playground"
  },
  {
    path: "/project/:projectId/section/calendar",
    element: <Project><ProjectCalendar /></Project>,
    title: "playground"
  },
  {
    path: "/project/:projectId/section/list",
    element: <Project><ProjectList /></Project>,
    title: "playground"
  },
  {
    path: "/project/:projectId/setting",
    element: <Project><ProjectSetting /></Project>,
    title: "playground"
  }, {
    path: "/playground/list-wp",
    element: <ListWorkspace />,
    title: "playground"
  }, {
  },
  {
    path: "/playground/task",
    element: <CustomTaskDialog />,
    title: "playground"
  },
  {
    path: "/playground/tasktype",
    element: <CustomColorPicker />,
    title: "playground"
  },
  {
    path: "/playground/gantt",
    element: <TestGantt />,
    title: "playground"
  },
  {
    path: "/playground/dnd-grid",
    element: <DnDGrid />,
    title: "playground"
  },
  {
    path: "/test/darkmode",
    element: <CustomStatusColorIconPicker />,
    title: "playground"
  },
  {
    path: "/playground/email-chip",
    element: <EmailChipInput />,
    title: "playground"
  },
];

export default pagesData;
