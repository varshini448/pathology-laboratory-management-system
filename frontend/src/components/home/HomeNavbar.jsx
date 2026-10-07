import { Link } from "react-router-dom";

const HomeNavbar = () => {
  return (
    <header className="home-navbar">
      <div className="home-container home-navbar-inner">
        <Link to="/" className="home-brand">
          <span className="home-brand-mark">PL</span>

          <span className="home-brand-text">
            <strong>Pathology LIS</strong>
            <small>Laboratory Information System</small>
          </span>
        </Link>

        <nav className="home-navigation" aria-label="Main navigation">
          <a href="#platform">Platform</a>
          <a href="#workflow">Workflow</a>
          <a href="#ai-assistance">AI Assistance</a>
          <a href="#about">About</a>
        </nav>

        <div className="home-navbar-actions">
          <Link to="/login" className="home-login-link">
            Login
          </Link>

          <Link to="/register" className="home-primary-button">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HomeNavbar;
