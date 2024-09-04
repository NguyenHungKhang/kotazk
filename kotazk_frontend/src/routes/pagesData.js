import Home from "../pages/Home";
import Kanban from "../pages/Kanban";
import Login from "../pages/Login";
import ProjectMember from "../pages/ProjectMember";
import WorkSpace from "../pages/WorkSpace";
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
    path: "/work-space",
    element: <WorkSpace />,
    title: "playground"
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
    element: <TestGantt />,
    title: "playground"
  },
];

export default pagesData;
