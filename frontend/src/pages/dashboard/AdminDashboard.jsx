import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import AdminDashboardOverview from "./AdminDashboardOverview";
import AdminDashboardManagement from "./AdminDashboardManagement";
import "../../styles/admin-dashboard.css";
import "../../styles/admin-dashboard-stats.css";
import "../../styles/admin-dashboard-panels.css";
import "../../styles/admin-dashboard-workflow.css";
import "../../styles/admin-dashboard-actions.css";

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userName = user?.name || "Administrator";

  return (
    <div className="admin-dashboard-page">
      <section className="admin-page-heading">
        <div>
          <span className="admin-page-eyebrow">
            LABORATORY OPERATIONS
          </span>

          <h1>Operations Overview</h1>

          <p>
            Monitor laboratory activity, workflow progress,
            reports and operational tasks.
          </p>
        </div>

        <div className="admin-page-actions">
          <span className="admin-welcome">
            Welcome, {userName}
          </span>

          <Link
            to="/patients/add"
            className="admin-primary-action"
          >
            <Plus size={17} />
            Register Patient
          </Link>
        </div>
      </section>

      <AdminDashboardOverview />

      <AdminDashboardManagement />
    </div>
  );
};

export default AdminDashboard;
