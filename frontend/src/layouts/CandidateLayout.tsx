import CandidateSidebar from "../candidate/components/CandidateSidebar";
import { Outlet } from "react-router-dom";

const CandidateLayout = () => {
  return (
    <div className="flex min-h-screen bg-(--bg)">
      <aside>
        <CandidateSidebar />
      </aside>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Outlet />{" "}
      </main>
    </div>
  );
};

export default CandidateLayout;
