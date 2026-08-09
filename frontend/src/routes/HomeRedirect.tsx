import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/contexts/AuthContext";
import HomePage from "../pages/HomePage";
import PublicLayout from "../layouts/PublicLayout";

const HomeRedirect = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Not logged in → public homepage
  if (!user) {
    return (
      <PublicLayout>
        <HomePage />
      </PublicLayout>
    );
  }

  // Logged in → role dashboard
  switch (user.role) {
    case "CANDIDATE":
      return <Navigate to="/candidate/dashboard" replace />;

    case "RECRUITER":
      return <Navigate to="/recruiter/dashboard" replace />;

    case "ADMIN":
      return <Navigate to="/admin/dashboard" replace />;

    default:
      return <Navigate to="/" replace />;
  }
};

export default HomeRedirect;
