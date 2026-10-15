import React, { useEffect, useState } from "react";

import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { getCurrentUser, logoutUser } from "../services/authService";
import GlobalSearch from "../components/layout/GlobalSearch";
import NotificationMenu from "../components/layout/NotificationMenu";
import "../styles/design/global-search-notifications.css";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

const AppShell = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const role = currentUser?.role || currentUser?.userType;
  const dashboardPath = {
    ADMIN: "/admin-dashboard",
    TECHNICIAN: "/technician-dashboard",
    PATHOLOGIST: "/pathologist-dashboard",
    QUALITY_MANAGER: "/quality-dashboard",
    DOCTOR: "/doctor-dashboard",
    PATIENT: "/patient-dashboard",
  }[role] || "/dashboard";
  const isInternalRole = [
    "ADMIN",
    "TECHNICIAN",
    "PATHOLOGIST",
    "QUALITY_MANAGER",
  ].includes(role);
  const canViewAudit = ["ADMIN", "QUALITY_MANAGER"].includes(role);
  const navClassName = ({ isActive }) =>
    `app-shell-nav-item${isActive ? " is-active" : ""}`;

  useEffect(() => {
    let inactivityTimer;

    const handleLogout = () => {
      logoutUser();
      navigate("/login", { replace: true });
    };

    const resetInactivityTimer = () => {
      window.clearTimeout(inactivityTimer);

      inactivityTimer = window.setTimeout(() => {
        handleLogout();
      }, INACTIVITY_TIMEOUT);
    };

    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetInactivityTimer);
    });

    resetInactivityTimer();

    return () => {
      window.clearTimeout(inactivityTimer);

      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetInactivityTimer);
      });
    };
  }, [navigate]);

  const handleSignOut = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  const displayName = currentUser?.name || currentUser?.username || "User";
  const displayRole = role || "Laboratory Staff";

  return (
    <div
      className={`app-shell ${
        sidebarCollapsed ? "app-shell--collapsed" : ""
      }`}
    >
      <aside className="app-shell-sidebar">
        <div className="app-shell-brand">
          <div className="app-shell-brand-mark">P</div>
          <div className="app-shell-brand-text">
            <strong>Pathology</strong>
            <span>Intelligence Platform</span>
          </div>
        </div>

        <nav
          className="app-shell-navigation"
          aria-label="Primary navigation"
        >
          <div className="app-shell-nav-section">
            <span className="app-shell-nav-label">Workspace</span>

            <NavLink to={dashboardPath} end className={navClassName}>
              <span className="app-shell-nav-icon">⌂</span>
              <span className="app-shell-nav-text">Overview</span>
            </NavLink>

            {role === "DOCTOR" && (
              <>
                <NavLink to="/doctor/assigned-cases" className={navClassName}>
                  <span className="app-shell-nav-icon">▣</span>
                  <span className="app-shell-nav-text">Assigned Cases</span>
                </NavLink>
                <NavLink to="/doctor/assigned-reports" className={navClassName}>
                  <span className="app-shell-nav-icon">▤</span>
                  <span className="app-shell-nav-text">Reports</span>
                </NavLink>
              </>
            )}

            {role === "PATIENT" && (
              <>
                <NavLink to="/patient/cases" className={navClassName}>
                  <span className="app-shell-nav-icon">▣</span>
                  <span className="app-shell-nav-text">My Pathology Cases</span>
                </NavLink>
                <NavLink to="/patient/reports" className={navClassName}>
                  <span className="app-shell-nav-icon">▤</span>
                  <span className="app-shell-nav-text">Finalized Reports</span>
                </NavLink>
              </>
            )}

            {isInternalRole && <NavLink to="/cases" className={navClassName}>
              <span className="app-shell-nav-icon">▣</span>
              <span className="app-shell-nav-text">Cases</span>
            </NavLink>}

            {isInternalRole && <NavLink to="/specimens" className={navClassName}>
              <span className="app-shell-nav-icon">◈</span>
              <span className="app-shell-nav-text">Workflow</span>
            </NavLink>}

            {isInternalRole && <NavLink to="/reports" className={navClassName}>
              <span className="app-shell-nav-icon">▤</span>
              <span className="app-shell-nav-text">Review & Reports</span>
            </NavLink>}

            {role === "ADMIN" && <NavLink to="/users" className={navClassName}>
              <span className="app-shell-nav-icon">♙</span>
              <span className="app-shell-nav-text">User Management</span>
            </NavLink>}
            {role === "ADMIN" && <NavLink to="/patients" className={navClassName}>
              <span className="app-shell-nav-icon">♧</span>
              <span className="app-shell-nav-text">Patient Directory</span>
            </NavLink>}
            {role === "ADMIN" && <NavLink to="/doctors" className={navClassName}>
              <span className="app-shell-nav-icon">⚕</span>
              <span className="app-shell-nav-text">Doctor Directory</span>
            </NavLink>}
          </div>

          {isInternalRole && <div className="app-shell-nav-section">
            <span className="app-shell-nav-label">Quality</span>

            {isInternalRole && <NavLink to="/qc" className={navClassName}>
              <span className="app-shell-nav-icon">✓</span>
              <span className="app-shell-nav-text">Quality Control</span>
            </NavLink>}

            {isInternalRole && <NavLink to="/tat" className={navClassName}>
              <span className="app-shell-nav-icon">◷</span>
              <span className="app-shell-nav-text">TAT & Performance</span>
            </NavLink>}


          </div>}

          {canViewAudit && <div className="app-shell-nav-section">
            <span className="app-shell-nav-label">Oversight</span>
            <NavLink to="/audit-logs" className={navClassName}>
              <span className="app-shell-nav-icon">◫</span>
              <span className="app-shell-nav-text">Activity & Audit</span>
            </NavLink>
          </div>}
        </nav>

        <div className="app-shell-sidebar-footer">
          <span>Laboratory Information System</span>
          <small>v1.0 · Secure Workspace</small>
        </div>
      </aside>

      <div className="app-shell-main">
        <header className="app-shell-topbar">
          <div className="app-shell-topbar-left">
            <button
              type="button"
              className="app-shell-menu-button"
              onClick={() => setSidebarCollapsed((current) => !current)}
              aria-label={
                sidebarCollapsed
                  ? "Expand navigation"
                  : "Collapse navigation"
              }
              title={
                sidebarCollapsed
                  ? "Expand navigation"
                  : "Collapse navigation"
              }
            >
              <span className="app-shell-menu-icon">☰</span>
            </button>

            {isInternalRole && <GlobalSearch />}
          </div>

          <div className="app-shell-topbar-actions">
            <NotificationMenu />

            <div className="app-shell-user">
              <div className="app-shell-user-avatar">
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{displayName}</strong>
                <span>{displayRole}</span>
              </div>
            </div>

            <button
              type="button"
              className="app-shell-signout-button"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="app-shell-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
