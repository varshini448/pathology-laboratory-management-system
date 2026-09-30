export const hasPermission = (user, allowedRoles = []) => {
  if (!user || !user.role) return false;

  return allowedRoles.includes(user.role);
};

export const isAdmin = (user) => user?.role === "ADMIN";

export const isTechnician = (user) => user?.role === "TECHNICIAN";

export const isPathologist = (user) => user?.role === "PATHOLOGIST";

export const isQualityManager = (user) =>
  user?.role === "QUALITY_MANAGER";