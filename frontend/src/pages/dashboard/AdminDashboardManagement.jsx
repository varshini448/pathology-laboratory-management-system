import { Link } from "react-router-dom";
import {
  UserRound,
  ClipboardList,
  FlaskConical,
  Layers3,
  ScanLine,
  FileText,
  AlertCircle,
} from "lucide-react";
import AdminPendingApprovals from "./AdminPendingApprovals";

const AdminDashboardManagement = () => {
  return (
    <>
      <section className="admin-dashboard-panel admin-approval-panel">
        <div className="admin-panel-header">
          <div>
            <span>ADMINISTRATION</span>
            <h2>Pending User Approvals</h2>
          </div>

          <Link to="/users">
            Manage users
          </Link>
        </div>

        <AdminPendingApprovals />
      </section>

      <section className="admin-dashboard-panel">
        <div className="admin-panel-header">
          <div>
            <span>QUICK ACCESS</span>
            <h2>Common Laboratory Tasks</h2>
          </div>
        </div>

        <div className="admin-quick-actions">
          <Link to="/patients/add">
            <UserRound size={18} />
            Register Patient
          </Link>

          <Link to="/cases/add">
            <ClipboardList size={18} />
            Create Case
          </Link>

          <Link to="/specimens/add">
            <FlaskConical size={18} />
            Add Specimen
          </Link>

          <Link to="/blocks/add">
            <Layers3 size={18} />
            Add Block
          </Link>

          <Link to="/slides/add">
            <ScanLine size={18} />
            Add Slide
          </Link>

          <Link to="/reports">
            <FileText size={18} />
            Reports
          </Link>
        </div>
      </section>

      <div className="admin-system-notice">
        <AlertCircle size={17} />

        <div>
          <strong>Laboratory system status</strong>

          <span>
            Core laboratory modules are available from the
            navigation menu.
          </span>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardManagement;
