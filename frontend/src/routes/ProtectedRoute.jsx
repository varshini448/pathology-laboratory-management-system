import { Navigate, Outlet } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  getTokenExpiration,
  isTokenValid,
} from "../utils/authToken";
import {
  clearAuthSession,
  getAuthToken,
  getAuthUser,
} from "../utils/authStorage";

const ProtectedRoute = () => {
  const token = getAuthToken();
  const user = getAuthUser();

  const hasValidSession =
    isTokenValid(token) &&
    user !== null &&
    typeof user === "object" &&
    !Array.isArray(user);

  const [sessionExpired, setSessionExpired] = useState(false);

  const expireSession = useCallback(() => {
    clearAuthSession();
    setSessionExpired(true);
  }, []);

  useEffect(() => {
    if (!hasValidSession) {
      return;
    }

    const expiration = getTokenExpiration(token);

    if (expiration === null) {
      expireSession();
      return;
    }

    const checkSession = () => {
      if (!isTokenValid(token)) {
        expireSession();
      }
    };

    const remainingTime = expiration - Date.now();
    const maxTimeout = 2_147_000_000;

    const timeoutId = window.setTimeout(
      checkSession,
      Math.min(Math.max(remainingTime, 0), maxTimeout)
    );

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSession();
      }
    };

    const handleAuthExpired = () => {
      expireSession();
    };

    window.addEventListener("focus", checkSession);
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );
    window.addEventListener("auth:expired", handleAuthExpired);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("focus", checkSession);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
      window.removeEventListener("auth:expired", handleAuthExpired);
    };
  }, [token, hasValidSession, expireSession]);

  if (!hasValidSession || sessionExpired) {
    if (!sessionExpired) {
      clearAuthSession();
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
