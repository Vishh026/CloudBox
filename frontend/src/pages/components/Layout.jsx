import { useState } from "react";
import Sidebar from "./Sidebar";
import TopNav from "./Topnav";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onCollapse={toggleSidebar} />

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        {/* TopNav */}
        <TopNav toggleSidebar={toggleSidebar} />

        {/* Page content */}
        <div className="pt-14 px-4 lg:px-6 bg-gray-950 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
