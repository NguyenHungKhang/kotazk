import CustomAddWorkspaceDialog from "../components/CustomAddWorkspaceDialog";
import CustomDarkModeSwitch from "../components/CustomDarkModeSwitch";
import CustomSaveProjectDialog from "../components/CustomSaveProjectDialog";
import Home from "../pages/Home";
import Kanban from "../pages/Kanban";
import Login from "../pages/Login";
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
    element: <Kanban />,
    title: "project"
  },
  {
    path: "/project/member",
    element: <ProjectMember />,
    title: "Project Member"
  },
  {
    path: "/kanban",
    element: <Kanban />,
    title: "playground"
  },
  {
    path: "/playground",
    element: <CustomSaveProjectDialog />,
    title: "playground"
  },
  {
    path: "/test/darkmode",
    element: <CustomDarkModeSwitch />,
    title: "playground"
  },
];

export default pagesData;
