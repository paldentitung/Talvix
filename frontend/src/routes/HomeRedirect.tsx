// routes/HomeRedirect.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/contexts/AuthContext";
import HomePage from "../pages/HomePage";

const HomeRedirect = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Not logged in → public homepage (layout comes from the route config)
  if (!user) {
    return <HomePage />;
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
      return <Navigate to="/login" replace />;
  }
};

export default HomeRedirect;
