import "./App.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./Layouts/mainLayout/MainLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import MonthView from "./pages/monthView/MonthView";
import AttendanceReport from "./pages/attendanceReport/AttendanceReport";
import Settings from "./pages/settings/Settings";
import Login from "./pages/login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/month",
        element: <MonthView />,
      },
      {
        path: "/month/:id",
        element: <MonthView />,
      },
      {
        path: "/report",
        element: <AttendanceReport />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
