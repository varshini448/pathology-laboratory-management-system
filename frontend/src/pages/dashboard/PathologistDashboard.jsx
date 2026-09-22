import { Link } from "react-router-dom";

const PathologistDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="dashboard-page">
      <h1>Pathologist Dashboard</h1>

      <p>
        Welcome{user?.name ? `, ${user.name}` : ""}!
      </p>

      <p>
        Review pathology cases, manage reports, and complete final sign-out.
      </p>

      <hr />

      <section>
        <h2>Case Management</h2>

        <div>
          <h3>Cases</h3>
          <Link to="/cases">View Cases</Link>
        </div>

        <div>
          <h3>Turnaround Time</h3>
          <Link to="/tat">View TAT Dashboard</Link>
        </div>
      </section>

      <hr />

      <section>
        <h2>Pathology Reporting</h2>

        <div>
          <h3>Reports</h3>
          <Link to="/reports">View Reports</Link>
        </div>

        <div>
          <h3>Pathologist Workspace</h3>
          <Link to="/pathologist-workspace">
            Open Pathologist Workspace
          </Link>
        </div>

        <div>
          <h3>Draft Reports</h3>
          <Link to="/reports/drafts">View Draft Reports</Link>
        </div>

        <div>
          <h3>Final Sign-out</h3>
          <Link to="/reports/sign-out">
            View Reports Pending Sign-out
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PathologistDashboard;