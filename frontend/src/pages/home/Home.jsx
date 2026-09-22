import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-logo">
          <h2>Pathology LIS</h2>
        </div>

        <nav className="home-navigation">
          <Link to="/login" className="home-nav-button">
            Login
          </Link>

          <Link to="/register" className="home-nav-button primary">
            Register
          </Link>
        </nav>
      </header>

      <main className="home-content">
        <section className="home-hero">
          <h1>Pathology Laboratory Management System</h1>

          <p>
            A centralized laboratory management system for managing
            patients, cases, specimens, laboratory workflows, quality
            control, pathology reports, and turnaround time.
          </p>

          <div className="home-actions">
            <Link to="/login" className="home-button">
              Login
            </Link>

            <Link to="/register" className="home-button secondary">
              Create Account
            </Link>
          </div>
        </section>

        <section className="home-features">
          <h2>System Features</h2>

          <div className="feature-grid">
            <div className="feature-card">
              <h3>Patient Management</h3>
              <p>
                Register and manage patient information and laboratory
                cases.
              </p>
            </div>

            <div className="feature-card">
              <h3>Laboratory Workflow</h3>
              <p>
                Track specimens, blocks, slides, and laboratory processing
                stages.
              </p>
            </div>

            <div className="feature-card">
              <h3>Quality Control</h3>
              <p>
                Monitor laboratory quality checks and corrective actions.
              </p>
            </div>

            <div className="feature-card">
              <h3>Pathology Reporting</h3>
              <p>
                Create, review, and finalize pathology reports securely.
              </p>
            </div>

            <div className="feature-card">
              <h3>TAT Monitoring</h3>
              <p>
                Monitor case turnaround time and identify delayed cases.
              </p>
            </div>

            <div className="feature-card">
              <h3>Role-Based Access</h3>
              <p>
                Provide different system capabilities based on user roles.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;