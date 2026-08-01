import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import Header from "../components/Header";

const MainLayouts = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-(--bg)">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar: fixed drawer on mobile, static column on desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SideBar onNavigate={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayouts;
