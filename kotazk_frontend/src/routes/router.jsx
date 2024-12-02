import { Route, Routes } from "react-router-dom";
import pagesData from "./pagesData";
import AuthCheck from "./AuthCheck"; // Import AuthCheck component

const Router = () => {
  const pageRoutes = pagesData.map(({ path, title, element }) => {
    return <Route key={title} path={`/${path}`} element={element} />;
  });

  return (
    <>
      <AuthCheck />
      <Routes>{pageRoutes}</Routes>
    </>
  );
};

export default Router;
