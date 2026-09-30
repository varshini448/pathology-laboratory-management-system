import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="error-page">
      <div className="error-card">
        <span className="error-code">404</span>
        <h1>Page Not Found</h1>
        <p>
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link to="/dashboard" className="error-action">
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
