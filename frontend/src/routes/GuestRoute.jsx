import { Navigate, Outlet } from "react-router-dom";
import { isTokenValid } from "../utils/authToken";
import {
  clearAuthSession,
  getAuthToken,
  getAuthUser,
} from "../utils/authStorage";

const GuestRoute = () => {
  const token = getAuthToken();
  const user = getAuthUser();

  if (
    isTokenValid(token) &&
    user !== null &&
    typeof user === "object" &&
    !Array.isArray(user)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  clearAuthSession();

  return <Outlet />;
};

export default GuestRoute;
