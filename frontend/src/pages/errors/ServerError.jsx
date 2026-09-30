import React from "react";
import { Link } from "react-router-dom";

const ServerError = () => {
  return (
    <main className="error-page">
      <div className="error-card">
        <span className="error-code">500</span>
        <h1>Server Error</h1>
        <p>
          Something went wrong while processing your request. Please try again
          or return to the dashboard.
        </p>
        <Link to="/dashboard" className="error-action">
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
};

export default ServerError;
