import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import JobPostingModal from "../components/JobPostingModal";
import Sidebar from "../components/Sidebar";
import { useCreateJob } from "../../features/jobs/hooks/useCreateJob";

const RecruiterLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPostOpen, setIsPostOpen] = useState(false);

  const postJobMutation = useCreateJob();

  return (
    <div className="min-h-screen bg-(--bg)">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar: always fixed to the viewport, slides in on mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
      </div>

      {/* Content offset by the sidebar's width on large screens */}
      <div className="flex min-h-screen flex-col lg:ml-64">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Header
            onMenuClick={() => setIsSidebarOpen(true)}
            openJobPostingModal={() => setIsPostOpen(true)}
          />
          <Outlet />
        </main>
      </div>

      <JobPostingModal
        isOpen={isPostOpen}
        onClose={() => setIsPostOpen(false)}
        onSubmit={async (values) => {
          try {
            await postJobMutation.mutateAsync({
              ...values,
              deadline: values.deadline || null,
            });
            setIsPostOpen(false);
          } catch (error) {
            console.error(error);
          }
        }}
      />
    </div>
  );
};

export default RecruiterLayout;
