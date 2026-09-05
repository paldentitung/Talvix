import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../admin/components/AdminHeader";
import AdminSidebar from "../admin/components/AdminSidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-(--bg)">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar: always fixed to the viewport, slides in on mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar
          onNavigate={() => setIsSidebarOpen(false)}
          reportsCount={12}
        />
      </div>

      {/* Content offset by the sidebar's width on large screens */}
      <div className="flex min-h-screen flex-col lg:ml-64">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
