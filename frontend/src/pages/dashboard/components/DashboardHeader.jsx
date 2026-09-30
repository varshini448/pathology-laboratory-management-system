import React from "react";

const DashboardHeader = ({
  title = "Dashboard",
  subtitle,
  userName,
  role,
  actions,
}) => {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header-content">
        <div>
          <p className="dashboard-eyebrow">PATHOLOGY LABORATORY</p>
          <h1>{title}</h1>

          {subtitle && <p className="dashboard-subtitle">{subtitle}</p>}

          {userName && (
            <p className="dashboard-user-context">
              Welcome, <strong>{userName}</strong>
              {role ? ` • ${role}` : ""}
            </p>
          )}
        </div>

        {actions && <div className="dashboard-header-actions">{actions}</div>}
      </div>
    </header>
  );
};

export default DashboardHeader;
