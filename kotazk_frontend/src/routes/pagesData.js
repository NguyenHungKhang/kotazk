import CustomColorPicker from "../components/CustomColorPicker";
import CustomStatusColorIconPicker from "../components/CustomStatusColorIconPicker";
import CustomTaskDialog from "../components/CustomTaskDialog";
import MainLayout from "../layouts";
import ForgotPassword from "../pages/ForgotPassword";
import Gantt from "../pages/Gantt";
import Home from "../pages/Home";
import Login from "../pages/Login";
import OtpVerification from "../pages/OtpVerification";
import ProfileSetting from "../pages/ProfileSetting";
import Project from "../pages/Project";
import ProjectActivityLog from "../pages/ProjectActivityLog";
import ProjectCalendar from "../pages/ProjectCalendar";
import ProjectDashBoard from "../pages/ProjectDashBoard";
import ProjectList from "../pages/ProjectList";
import ProjectMember from "../pages/ProjectMember";
import ProjectReport from "../pages/ProjectReport";
import ProjectRole from "../pages/ProjectRole";
import ProjectSetting from "../pages/ProjectSetting";
import Register from "../pages/Register";
import Section from "../pages/Section";
import Workspace from "../pages/WorkSpace";
import UserWorkspaceTaskDashBoard from "../pages/WorkSpaceDashBoard";
import WorkSpaceMember from "../pages/WorkSpaceMember";
import WorkspaceDashBoard from "../pages/WorkSpaceProjectList";
import WorkspaceActivityLog from "../pages/WorkspaceActivityLog";
import WorkspaceList from "../pages/Dashboard";
import WorkspaceRole from "../pages/WorkspaceRole";
import WorkspaceSetting from "../pages/WorkspaceSetting";
import DnDGrid from "../playgrounds/components/DndGrid";
import EmailChipInput from "../playgrounds/components/EmailChipInput";
import ListWorkspace from "../playgrounds/components/TestDnDLap";
import TestGantt from "../playgrounds/components/TestGantt";

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
    element: <MainLayout> <WorkspaceList /> </MainLayout>,
    title: "workspace"
  },
  {
    path: "/workspace/:workspaceId/dashboard",
    element: <Workspace ><UserWorkspaceTaskDashBoard /> </Workspace>,
    title: "workspace"
  },
  {
    path: "/workspace/:workspaceId/projects",
    element: <Workspace ><WorkspaceDashBoard /> </Workspace>,
    title: "workspace"
  },
  {
    path: "/workspace/:workspaceId/setting",
    element: <Workspace ><WorkspaceSetting /> </Workspace>,
    title: "workspace"
  },

  {
    path: "/workspace/:workspaceId/activity-log",
    element: <Workspace ><WorkspaceActivityLog /> </Workspace>,
    title: "workspace"
  },
  {
    path: "/workspace/:workspaceId/setting/role",
    element: <Workspace ><WorkspaceRole /> </Workspace>,
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
    path: "/project/:projectId/activity-log",
    element: <Project><ProjectActivityLog /></Project>,
    title: "Project Activity Log"
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
