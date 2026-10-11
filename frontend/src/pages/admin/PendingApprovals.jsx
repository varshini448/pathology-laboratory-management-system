import { Link } from "react-router-dom";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import AdminPendingApprovals from "../dashboard/AdminPendingApprovals";

const PendingApprovals = () => {
  return (
    <main className="admin-dashboard-page">
      <section className="admin-dashboard-panel admin-approval-panel">
        <div className="admin-panel-header">
          <div>
            <span>ADMINISTRATION / ACCESS MANAGEMENT</span>
            <h2>Pending Approvals</h2>
          </div>

          <ClipboardCheck size={22} aria-hidden="true" />
        </div>

        <p>
          Review staff registrations, verify the submitted account details,
          and approve or reject access requests.
        </p>

        <AdminPendingApprovals />

        <div style={{ marginTop: "20px" }}>
          <Link to="/admin-dashboard">
            <ArrowLeft size={15} style={{ verticalAlign: "middle" }} /> Back
            to Administration
          </Link>
        </div>
      </section>
    </main>
  );
};

export default PendingApprovals;
