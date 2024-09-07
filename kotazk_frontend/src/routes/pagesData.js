import CustomAddWorkspaceDialog from "../components/CustomAddWorkspaceDialog";
import CustomDarkModeSwitch from "../components/CustomDarkModeSwitch";
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
    element: <CustomAddWorkspaceDialog />,
    title: "playground"
  },
  {
    path: "/test/darkmode",
    element: <CustomDarkModeSwitch />,
    title: "playground"
  },
];

export default pagesData;
