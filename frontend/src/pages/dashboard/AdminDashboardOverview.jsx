import { Link } from "react-router-dom";
import {
  Users,
  ClipboardCheck,
  History,
  ShieldCheck,
  Settings2,
  KeyRound,
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
    title: "Pending Approvals",
    description: "Review registrations awaiting administrator approval.",
    link: "/admin/pending-approvals",
    icon: ClipboardCheck,
  },
  {
    title: "Patient Directory",
    description: "Search registered patients and open authorized records.",
    link: "/patients",
    icon: Users,
  },
  {
    title: "Doctor Directory",
    description: "Search verified doctor accounts and professional details.",
    link: "/doctors",
    icon: Users,
  },
  {
    title: "Access Control",
    description: "Review the documented role boundaries and permissions.",
    link: "/users/access-control",
    icon: KeyRound,
  },
  {
    title: "Quality Management",
    description: "Review quality-control records and quality indicators.",
    link: "/qc",
    icon: ShieldCheck,
  },
  {
    title: "Workflow Configuration",
    description: "Review workflow stages; runtime configuration is not available.",
    link: "/admin/workflow-configuration",
    icon: Settings2,
  },
  {
    title: "Audit History",
    description: "Review recorded account and system activity.",
    link: "/audit-logs",
    icon: History,
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
