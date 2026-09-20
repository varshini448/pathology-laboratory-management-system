import { Link } from "react-router-dom";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div>
      <h1>Pathology Laboratory Management System</h1>

      <p>
        Welcome{user?.name ? `, ${user.name}` : ""}!
      </p>

      <h2>Dashboard</h2>

      <div>
        <h3>Patient Management</h3>
        <Link to="/patients">View Patients</Link>
        {" | "}
        <Link to="/patients/add">Add Patient</Link>
      </div>

      <div>
        <h3>Case Management</h3>
        <Link to="/cases">View Cases</Link>
        {" | "}
        <Link to="/cases/add">Add Case</Link>
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
    </div>
  );
};

export default Dashboard;
