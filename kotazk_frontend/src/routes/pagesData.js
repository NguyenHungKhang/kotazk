import Home from "../pages/Home";
import Login from "../pages/Login";
import WorkSpace1 from "../pages/Section";
import WorkSpace from "../pages/Workspace";
import TestSideBar from "../playgrounds/components/TestSideBar";
import Register from "../pages/Register";

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
    path: "/work-space1",
    element: <WorkSpace1 />,
    title: "playground"
  },
  {
    path: "/work-space",
    element: <WorkSpace />,
    title: "playground"
  },
  {
    path: "/playground",
    element: <TestSideBar />,
    title: "playground"
  },
];

export default pagesData;
