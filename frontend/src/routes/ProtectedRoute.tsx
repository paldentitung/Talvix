import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMe } from "../features/auth/hooks/useMe";

const ProtectedRoute = () => {
  const { data: user, isLoading } = useMe();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
