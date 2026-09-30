import React from "react";

const Topbar = ({
  title = "Pathology Laboratory Management System",
  user,
  actions,
}) => {
  return (
    <div className="topbar">
      <div className="topbar-title">
        <h2>{title}</h2>
      </div>

      <div className="topbar-right">
        {actions && (
          <div className="topbar-actions">
            {actions}
          </div>
        )}

        {user && (
          <div className="topbar-user">
            <div className="topbar-avatar" aria-hidden="true">
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>

            <div className="topbar-user-info">
              <strong>{user.name || "User"}</strong>
              {user.role && <span>{user.role}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;