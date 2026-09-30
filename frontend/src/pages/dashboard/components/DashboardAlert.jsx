import React from "react";

const DashboardAlert = ({
  title,
  message,
  type = "info",
  action,
}) => {
  return (
    <div
      className={`dashboard-alert dashboard-alert-${type}`}
      role={type === "error" || type === "warning" ? "alert" : "status"}
    >
      <div className="dashboard-alert-icon" aria-hidden="true">
        {type === "success"
          ? "✓"
          : type === "warning"
            ? "!"
            : type === "error"
              ? "×"
              : "i"}
      </div>

      <div className="dashboard-alert-content">
        {title && <strong>{title}</strong>}
        {message && <p>{message}</p>}
      </div>

      {action && <div className="dashboard-alert-action">{action}</div>}
    </div>
  );
};

export default DashboardAlert;
