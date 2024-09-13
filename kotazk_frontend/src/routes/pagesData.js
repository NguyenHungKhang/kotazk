import CustomAddWorkspaceDialog from "../components/CustomAddWorkspaceDialog";
import CustomDarkModeSwitch from "../components/CustomDarkModeSwitch";
import CustomSaveProjectDialog from "../components/CustomSaveProjectDialog";
import CustomTaskDialog from "../components/CustomTaskDialog";
import Home from "../pages/Home";
import Kanban from "../pages/Kanban";
import Login from "../pages/Login";
import Project from "../pages/Project";
import ProjectDashBoard from "../pages/ProjectDashBoard";
import ProjectMember from "../pages/ProjectMember";
import Workspace from "../pages/WorkSpace";
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
    path: "/workspace/:workspaceId",
    element: <Workspace />,
    title: "workspace"
  },
  {
    path: "/project/:projectId",
    element: <Project><ProjectDashBoard /></Project>,
    title: "project"
  },
  {
    path: "/project/:projectId/member",
    element: <Project><ProjectMember /></Project>,
    title: "Project Member"
  },
  {
    path: "/project/:projectId/section/:sectionId",
    element: <Project><Kanban /></Project>,
    title: "playground"
  },
  {
    path: "/playground",
    element: <CustomTaskDialog />,
    title: "playground"
  },
  {
    path: "/test/darkmode",
    element: <CustomDarkModeSwitch />,
    title: "playground"
  },
];

export default pagesData;
