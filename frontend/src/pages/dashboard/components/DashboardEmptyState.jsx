import React from "react";

const DashboardEmptyState = ({
  title = "No data available",
  message = "There is nothing to display here yet.",
  action,
}) => {
  return (
    <div className="dashboard-empty-state">
      <div className="dashboard-empty-icon" aria-hidden="true">
        ✓
      </div>

      <h3>{title}</h3>
      <p>{message}</p>

      {action && (
        <div className="dashboard-empty-action">
          {action}
        </div>
      )}
    </div>
  );
};

export default DashboardEmptyState;
