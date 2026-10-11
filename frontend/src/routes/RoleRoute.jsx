import { Navigate, Outlet } from "react-router-dom";
import { getAuthUser } from "../utils/authStorage";

const RoleRoute = ({ allowedRoles = [] }) => {
  const user = getAuthUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role || user.userType;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
