import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/contexts/AuthContext";
import type { UserRole } from "../shared/types/user.types";

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
