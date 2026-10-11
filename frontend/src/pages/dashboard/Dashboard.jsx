import { Navigate } from "react-router-dom";
import { getAuthUser } from "../../utils/authStorage";

const Dashboard = () => {
  const user = getAuthUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role || user.userType) {
    case "ADMIN":
      return <Navigate to="/admin-dashboard" replace />;

    case "TECHNICIAN":
      return <Navigate to="/technician-dashboard" replace />;

    case "PATHOLOGIST":
      return <Navigate to="/pathologist-dashboard" replace />;

    case "QUALITY_MANAGER":
      return <Navigate to="/quality-dashboard" replace />;

    case "DOCTOR":
      return <Navigate to="/doctor-dashboard" replace />;

    case "PATIENT":
      return <Navigate to="/patient-dashboard" replace />;

    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

export default Dashboard;
