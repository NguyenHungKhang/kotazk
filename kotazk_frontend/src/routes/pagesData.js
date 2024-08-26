import Home from "../pages/Home";
import Login from "../pages/Login";
import WorkSpace from "../pages/WorkSpace";
import TestSideBar from "../playgrounds/components/TestSideBar";

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
    path: "/playground",
    element: <TestSideBar />,
    title: "playground"
  },
];

export default pagesData;
