import { Link } from "react-router-dom";
import {
  UserRound,
  ClipboardList,
  ScanLine,
  FileText,
  Users,
  ShieldCheck,
  Clock3,
  ArrowRight,
} from "lucide-react";

const AdminDashboardOverview = () => {
  return (
    <>
      <section className="admin-stat-grid">
        <Link to="/patients" className="admin-stat-card">
          <div className="admin-stat-icon">
            <UserRound size={20} />
          </div>

          <div className="admin-stat-content">
            <span>Patient Records</span>
            <strong>View Patients</strong>
            <small>Registered laboratory patients</small>
          </div>

          <ArrowRight size={17} />
        </Link>

        <Link to="/cases" className="admin-stat-card">
          <div className="admin-stat-icon">
            <ClipboardList size={20} />
          </div>

          <div className="admin-stat-content">
            <span>Case Management</span>
            <strong>View Cases</strong>
            <small>Active and completed cases</small>
          </div>

          <ArrowRight size={17} />
        </Link>

        <Link to="/slides" className="admin-stat-card">
          <div className="admin-stat-icon">
            <ScanLine size={20} />
          </div>

          <div className="admin-stat-content">
            <span>Digital Pathology</span>
            <strong>View Slides</strong>
            <small>Slides and review workflow</small>
          </div>

          <ArrowRight size={17} />
        </Link>

        <Link to="/reports" className="admin-stat-card">
          <div className="admin-stat-icon">
            <FileText size={20} />
          </div>

          <div className="admin-stat-content">
            <span>Pathology Reports</span>
            <strong>View Reports</strong>
            <small>Reports and sign-out workflow</small>
          </div>

          <ArrowRight size={17} />
        </Link>
      </section>

      <section className="admin-dashboard-grid">
        <div className="admin-dashboard-panel">
          <div className="admin-panel-header">
            <div>
              <span>WORKFLOW</span>
              <h2>Laboratory Workflow</h2>
            </div>

            <Link to="/cases">
              View cases
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="admin-workflow-list">
            <div className="admin-workflow-row">
              <div className="admin-workflow-number">01</div>

              <div>
                <strong>Specimen Collection</strong>
                <span>Collection and accessioning</span>
              </div>

              <span className="admin-status completed">
                Completed
              </span>
            </div>

            <div className="admin-workflow-row">
              <div className="admin-workflow-number">02</div>

              <div>
                <strong>Laboratory Processing</strong>
                <span>Grossing, embedding and sectioning</span>
              </div>

              <span className="admin-status processing">
                In Process
              </span>
            </div>

            <div className="admin-workflow-row">
              <div className="admin-workflow-number">03</div>

              <div>
                <strong>Slide Processing</strong>
                <span>Staining and scanning</span>
              </div>

              <span className="admin-status processing">
                Monitoring
              </span>
            </div>

            <div className="admin-workflow-row">
              <div className="admin-workflow-number">04</div>

              <div>
                <strong>Pathologist Review</strong>
                <span>Review and final sign-out</span>
              </div>

              <span className="admin-status pending">
                Pending
              </span>
            </div>
          </div>
        </div>

        <div className="admin-dashboard-panel">
          <div className="admin-panel-header">
            <div>
              <span>ACTIONS</span>
              <h2>Pending Actions</h2>
            </div>
          </div>

          <div className="admin-action-list">
            <Link to="/users" className="admin-action-row">
              <div className="admin-action-icon">
                <Users size={18} />
              </div>

              <div>
                <strong>User Administration</strong>
                <span>Review and manage laboratory users</span>
              </div>

              <ArrowRight size={16} />
            </Link>

            <Link
              to="/reports/sign-out"
              className="admin-action-row"
            >
              <div className="admin-action-icon">
                <FileText size={18} />
              </div>

              <div>
                <strong>Report Sign-out</strong>
                <span>
                  Review reports awaiting final sign-out
                </span>
              </div>

              <ArrowRight size={16} />
            </Link>

            <Link to="/qc" className="admin-action-row">
              <div className="admin-action-icon">
                <ShieldCheck size={18} />
              </div>

              <div>
                <strong>Quality Control</strong>
                <span>Review laboratory quality records</span>
              </div>

              <ArrowRight size={16} />
            </Link>

            <Link to="/tat" className="admin-action-row">
              <div className="admin-action-icon">
                <Clock3 size={18} />
              </div>

              <div>
                <strong>Turnaround Time</strong>
                <span>Monitor case processing timelines</span>
              </div>

              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminDashboardOverview;
