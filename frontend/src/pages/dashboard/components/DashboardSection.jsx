import React from "react";

const DashboardSection = ({
  title,
  subtitle,
  actions,
  children,
  className = "",
}) => {
  return (
    <section className={`dashboard-section ${className}`.trim()}>
      <div className="dashboard-section-header">
        <div>
          {title && <h2>{title}</h2>}
          {subtitle && <p>{subtitle}</p>}
        </div>

        {actions && (
          <div className="dashboard-section-actions">{actions}</div>
        )}
      </div>

      <div className="dashboard-section-content">{children}</div>
    </section>
  );
};

export default DashboardSection;
