import { Link } from "react-router-dom";

const TechnicianDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="dashboard-page">
      <h1>Technician Dashboard</h1>

      <p>
        Welcome{user?.name ? `, ${user.name}` : ""}!
      </p>

      <p>
        Manage laboratory specimen processing and workflow activities.
      </p>

      <hr />

      <section>
        <h2>Laboratory Workflow</h2>

        <div>
          <h3>Cases</h3>
          <Link to="/cases">View Cases</Link>
          {" | "}
          <Link to="/cases/add">Create Case</Link>
        </div>

        <div>
          <h3>Specimens</h3>
          <Link to="/specimens">View Specimens</Link>
          {" | "}
          <Link to="/specimens/add">Add Specimen</Link>
        </div>

        <div>
          <h3>Blocks</h3>
          <Link to="/blocks">View Blocks</Link>
          {" | "}
          <Link to="/blocks/add">Add Block</Link>
        </div>

        <div>
          <h3>Slides</h3>
          <Link to="/slides">View Slides</Link>
          {" | "}
          <Link to="/slides/add">Add Slide</Link>
        </div>
      </section>

      <hr />

      <section>
        <h2>Quality Control</h2>

        <Link to="/qc">QC Dashboard</Link>
        {" | "}
        <Link to="/qc/add">Add QC Record</Link>
        {" | "}
        <Link to="/qc/records">View QC Records</Link>
      </section>

      <hr />

      <section>
        <h2>Turnaround Time</h2>

        <Link to="/tat">Monitor TAT</Link>
      </section>
    </div>
  );
};

export default TechnicianDashboard;