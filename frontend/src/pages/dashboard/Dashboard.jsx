import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "ADMIN":
      return <Navigate to="/admin-dashboard" replace />;

    case "TECHNICIAN":
      return <Navigate to="/technician-dashboard" replace />;

    case "PATHOLOGIST":
      return <Navigate to="/pathologist-dashboard" replace />;

    case "QUALITY_MANAGER":
      return <Navigate to="/quality-dashboard" replace />;

    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

export default Dashboard;