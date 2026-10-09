import { Link } from "react-router-dom";
import {
  Users,
  UserPlus,
  ClipboardCheck,
  History,
  ShieldCheck,
  Settings2,
  ArrowRight,
} from "lucide-react";

const adminSections = [
  {
    title: "User Management",
    description: "Manage staff accounts and review user records.",
    link: "/users",
    icon: Users,
  },
  {
    title: "Add Staff User",
    description: "Access the existing staff account creation page.",
    link: "/users/add",
    icon: UserPlus,
  },
  {
    title: "Pending Approvals",
    description: "Review registrations awaiting administrator approval.",
    link: "#pending-approvals",
    icon: ClipboardCheck,
  },
  {
    title: "Audit Logs",
    description: "Review recorded account and system activity.",
    link: "/audit-logs",
    icon: History,
  },
  {
    title: "Quality Records",
    description: "Open the existing laboratory quality module.",
    link: "/qc",
    icon: ShieldCheck,
  },
  {
    title: "Workflow Configuration",
    description: "Check the available workflow management area.",
    link: "/cases",
    icon: Settings2,
  },
];

const AdminDashboardOverview = () => {
  return (
    <section className="admin-dashboard-panel admin-overview-panel">
      <div className="admin-panel-header">
        <div>
          <span>ADMINISTRATION</span>
          <h2>Administrative Overview</h2>
        </div>
      </div>

      <div className="admin-overview-grid">
        {adminSections.map(({ title, description, link, icon: Icon }) => (
          <Link
            key={title}
            to={link}
            className="admin-overview-card"
          >
            <span className="admin-overview-icon">
              <Icon size={19} />
            </span>

            <span className="admin-overview-copy">
              <strong>{title}</strong>
              <small>{description}</small>
            </span>

            <ArrowRight
              className="admin-overview-arrow"
              size={16}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AdminDashboardOverview;
