import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "./sidebar.css";

const DashboardLayout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
