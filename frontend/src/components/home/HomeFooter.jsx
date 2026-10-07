import { Link } from "react-router-dom";

const HomeFooter = () => {
  return (
    <footer id="about" className="home-footer">
      <div className="home-container">
        <div className="home-cta">
          <div>
            <span className="home-eyebrow">Pathology LIS</span>

            <h2>
              Bring your pathology workflow into
              <span> one connected system.</span>
            </h2>

            <p>
              Track specimens, manage slides, support quality workflows,
              monitor turnaround time, and manage pathology reporting from
              one platform.
            </p>
          </div>

          <Link to="/login" className="home-primary-button">
            Open Laboratory Portal
          </Link>
        </div>

        <div className="home-footer-main">
          <div className="home-footer-brand">
            <Link to="/" className="home-brand">
              <span className="home-brand-mark">PL</span>

              <span className="home-brand-text">
                <strong>Pathology LIS</strong>
                <small>Laboratory Information System</small>
              </span>
            </Link>

            <p>
              A pathology laboratory management platform designed for
              connected, traceable laboratory workflows.
            </p>
          </div>

          <div className="home-footer-links">
            <div>
              <h3>Platform</h3>
              <a href="#platform">Capabilities</a>
              <a href="#workflow">Workflow</a>
              <a href="#ai-assistance">AI Assistance</a>
            </div>

            <div>
              <h3>Access</h3>
              <Link to="/login">Login</Link>
              <Link to="/register">Get Started</Link>
            </div>
          </div>
        </div>

        <div className="home-footer-bottom">
          <span>
            For academic demonstration and laboratory workflow management.
          </span>

          <span>© 2026 Pathology Laboratory Management System</span>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
