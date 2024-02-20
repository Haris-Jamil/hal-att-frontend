import Navbar from "../../components/navbar/Navbar";
import { Outlet, Navigate } from "react-router-dom";

const MainLayout = () => {
  const user = localStorage.getItem("tii-att-user");

  if (!user) {
    return <Navigate to='/login' />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
export default MainLayout;
