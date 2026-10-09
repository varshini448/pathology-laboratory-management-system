import { Link } from "react-router-dom";
import {
  Users,
  UserPlus,
  ClipboardCheck,
  ShieldCheck,
  History,
  ArrowUpRight,
} from "lucide-react";
import AdminPendingApprovals from "./AdminPendingApprovals";
import AdminRecentActivity from "./AdminRecentActivity";

const adminActions = [
  {
    title: "Manage users",
    description: "Review staff accounts and user records.",
    to: "/users",
    icon: Users,
  },
  {
    title: "Add staff user",
    description: "Create an internal staff account.",
    to: "/users/add",
    icon: UserPlus,
  },
  {
    title: "Review approvals",
    description: "Review pending staff registrations.",
    to: "#pending-approvals",
    icon: ClipboardCheck,
  },
  {
    title: "Audit logs",
    description: "Review recorded administrative events.",
    to: "/audit-logs",
    icon: History,
  },
];

const AdminDashboardManagement = () => {
  return (
    <>
      <section
        id="pending-approvals"
        className="admin-dashboard-panel admin-approval-panel"
      >
        <div className="admin-panel-header">
          <div>
            <span>ACCESS MANAGEMENT</span>
            <h2>Pending User Approvals</h2>
          </div>

          <Link to="/users">
            Manage users <ArrowUpRight size={15} />
          </Link>
        </div>

        <AdminPendingApprovals />
      </section>

      <section className="admin-dashboard-panel">
        <div className="admin-panel-header">
          <div>
            <span>ADMINISTRATION</span>
            <h2>Administrative Shortcuts</h2>
          </div>
        </div>

        <div className="admin-quick-actions">
          {adminActions.map(({ title, description, to, icon: Icon }) => (
            <Link
              key={title}
              to={to}
              className="admin-quick-action"
            >
              <span className="admin-quick-action-icon">
                <Icon size={19} />
              </span>

              <span className="admin-quick-action-copy">
                <strong>{title}</strong>
                <small>{description}</small>
              </span>

              <ArrowUpRight
                className="admin-quick-action-arrow"
                size={16}
              />
            </Link>
          ))}
        </div>
      </section>

      <AdminRecentActivity />

      <section className="admin-system-notice">
        <ShieldCheck size={18} />

        <div>
          <strong>Administrative access</strong>
          <span>
            Use the existing role-protected pages to manage accounts
            and review recorded activity.
          </span>
        </div>
      </section>
    </>
  );
};

export default AdminDashboardManagement;
