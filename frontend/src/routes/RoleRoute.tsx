// routes/RoleRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "../features/auth/hooks/useMe";
import type { UserRole } from "../shared/types/user.types";

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const { data: user, isLoading } = useMe();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
