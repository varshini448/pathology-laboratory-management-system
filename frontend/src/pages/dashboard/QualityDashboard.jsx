import { Link } from "react-router-dom";

const QualityDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="dashboard-page">
      <h1>Quality Manager Dashboard</h1>

      <p>
        Welcome{user?.name ? `, ${user.name}` : ""}!
      </p>

      <p>
        Monitor laboratory quality control, compliance activities, and
        turnaround time.
      </p>

      <hr />

      <section>
        <h2>Quality Control</h2>

        <div>
          <h3>QC Dashboard</h3>
          <Link to="/qc">Open QC Dashboard</Link>
        </div>

        <div>
          <h3>QC Records</h3>
          <Link to="/qc/records">View QC Records</Link>
        </div>

        <div>
          <h3>Add QC Record</h3>
          <Link to="/qc/add">Create QC Record</Link>
        </div>
      </section>

      <hr />

      <section>
        <h2>Turnaround Time Monitoring</h2>

        <div>
          <Link to="/tat">Open TAT Dashboard</Link>
        </div>
      </section>

      <hr />

      <section>
        <h2>Case Monitoring</h2>

        <div>
          <Link to="/cases">View Cases</Link>
        </div>

        <div>
          <Link to="/specimens">View Specimens</Link>
        </div>

        <div>
          <Link to="/slides">View Slides</Link>
        </div>
      </section>
    </div>
  );
};

export default QualityDashboard;