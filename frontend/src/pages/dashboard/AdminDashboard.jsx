import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="dashboard-page">
      <h1>Admin Dashboard</h1>

      <p>
        Welcome{user?.name ? `, ${user.name}` : ""}!
      </p>

      <p>
        Manage and monitor the Pathology Laboratory Management System.
      </p>

      <hr />

      <section>
        <h2>System Management</h2>

        <div>
          <h3>Patient Management</h3>
          <Link to="/patients">View Patients</Link>
          {" | "}
          <Link to="/patients/add">Register Patient</Link>
        </div>

        <div>
          <h3>Case Management</h3>
          <Link to="/cases">View Cases</Link>
          {" | "}
          <Link to="/cases/add">Create Case</Link>
        </div>

        <div>
          <h3>Specimen Management</h3>
          <Link to="/specimens">View Specimens</Link>
          {" | "}
          <Link to="/specimens/add">Add Specimen</Link>
        </div>

        <div>
          <h3>Block Management</h3>
          <Link to="/blocks">View Blocks</Link>
          {" | "}
          <Link to="/blocks/add">Add Block</Link>
        </div>

        <div>
          <h3>Slide Management</h3>
          <Link to="/slides">View Slides</Link>
          {" | "}
          <Link to="/slides/add">Add Slide</Link>
        </div>
      </section>

      <hr />

      <section>
        <h2>Quality & Monitoring</h2>

        <div>
          <h3>QA / QC</h3>
          <Link to="/qc">QC Dashboard</Link>
          {" | "}
          <Link to="/qc/records">QC Records</Link>
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
          <Link to="/reports">View Reports</Link>
          {" | "}
          <Link to="/reports/drafts">Draft Reports</Link>
          {" | "}
          <Link to="/reports/sign-out">Sign-out Reports</Link>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;