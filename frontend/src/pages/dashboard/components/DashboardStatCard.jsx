import React from "react";

const DashboardStatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  onClick,
}) => {
  return (
    <article
      className={`dashboard-stat-card${onClick ? " dashboard-stat-card-clickable" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          onClick();
        }
      }}
    >
      <div className="dashboard-stat-card-top">
        <div className="dashboard-stat-icon" aria-hidden="true">
          {icon || "•"}
        </div>

        {trend && <span className="dashboard-stat-trend">{trend}</span>}
      </div>

      <div className="dashboard-stat-value">{value}</div>

      <div className="dashboard-stat-title">{title}</div>

      {subtitle && (
        <p className="dashboard-stat-subtitle">{subtitle}</p>
      )}
    </article>
  );
};

export default DashboardStatCard;
