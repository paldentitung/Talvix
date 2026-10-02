import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

const PublicLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
