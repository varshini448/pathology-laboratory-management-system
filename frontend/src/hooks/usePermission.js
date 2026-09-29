import useAuth from "./useAuth";

const usePermission = () => {
  const { user, isAuthenticated } = useAuth();

  const hasRole = (role) => {
    if (!isAuthenticated || !user?.role) {
      return false;
    }

    return user.role === role;
  };

  const hasAnyRole = (roles = []) => {
    if (!isAuthenticated || !user?.role) {
      return false;
    }

    return roles.includes(user.role);
  };

  const isAdmin = () => hasRole("ADMIN");

  const isTechnician = () => hasRole("TECHNICIAN");

  const isPathologist = () => hasRole("PATHOLOGIST");

  const isQualityManager = () => hasRole("QUALITY_MANAGER");

  return {
    hasRole,
    hasAnyRole,
    isAdmin,
    isTechnician,
    isPathologist,
    isQualityManager,
  };
};

export default usePermission;