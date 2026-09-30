import React from "react";

const Maintenance = () => {
  return (
    <main className="error-page">
      <div className="error-card">
        <span className="error-code">503</span>
        <h1>System Maintenance</h1>
        <p>
          The pathology laboratory system is temporarily unavailable while
          maintenance is being performed. Please try again shortly.
        </p>
        <button
          type="button"
          className="error-action"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    </main>
  );
};

export default Maintenance;
