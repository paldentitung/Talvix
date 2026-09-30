import { useState } from "react";
import { Outlet } from "react-router-dom";
import CandidateHeader from "../candidate/components/CandidateHeader";
import CandidateSidebar from "../candidate/components/CandidateSidebar";
import { useGetCurrentUser } from "../features/users/hooks/useGetCurrentUser";

const CandidateLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: user } = useGetCurrentUser();

  return (
    <div className="h-screen overflow-hidden bg-(--bg)">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar: always fixed to the viewport, slides in on mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <CandidateSidebar onNavigate={() => setIsSidebarOpen(false)} />
      </div>

      {/* Content offset by the sidebar's width on large screens */}
      <div className="flex h-screen flex-col lg:ml-64">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <CandidateHeader
            onMenuClick={() => setIsSidebarOpen(true)}
            avatarUrl={user?.avatar}
          />
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default CandidateLayout;
