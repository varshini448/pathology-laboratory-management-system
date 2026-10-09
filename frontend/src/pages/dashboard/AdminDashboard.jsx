import { Link } from "react-router-dom";
import { Plus, ShieldCheck } from "lucide-react";
import AdminDashboardOverview from "./AdminDashboardOverview";
import AdminDashboardManagement from "./AdminDashboardManagement";
import "../../styles/admin-dashboard/admin-dashboard.css";
import "../../styles/admin-dashboard/admin-dashboard-stats.css";
import "../../styles/admin-dashboard/admin-dashboard-panels.css";
import "../../styles/admin-dashboard/admin-dashboard-workflow.css";
import "../../styles/admin-dashboard/admin-dashboard-actions.css";

const AdminDashboard = () => {
let user = null;

try {
user = JSON.parse(localStorage.getItem("user") || "null");
} catch {
user = null;
}

const userName = user?.name || "Administrator";

return ( <div className="admin-dashboard-page"> <section className="admin-page-heading"> <div> <span className="admin-page-eyebrow"> <ShieldCheck size={13} />
ADMINISTRATION & ACCESS CONTROL </span>

      <h1>Administrator Dashboard</h1>

      <p>
        Manage staff access, review registration requests,
        and monitor administrative activity.
      </p>
    </div>

    <div className="admin-page-actions">
      <span className="admin-welcome">
        Welcome, {userName}
      </span>

      <Link
        to="/users/add"
        className="admin-primary-action"
      >
        <Plus size={17} />
        Add Staff User
      </Link>
    </div>
  </section>

  <AdminDashboardOverview />

  <AdminDashboardManagement />
</div>


);
};

export default AdminDashboard;
