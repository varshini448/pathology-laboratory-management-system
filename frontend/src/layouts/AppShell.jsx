import React, { useEffect, useState } from "react";

import { Outlet, useNavigate } from "react-router-dom";

import { getCurrentUser, logoutUser } from "../services/authService";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

const AppShell = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const navigate = useNavigate();
  const currentUser = getCurrentUser();

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
  const displayRole = currentUser?.role || "Laboratory Staff";

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

            <a href="/dashboard" className="app-shell-nav-item">
              <span className="app-shell-nav-icon">⌂</span>
              <span className="app-shell-nav-text">Overview</span>
            </a>

            <a href="/cases" className="app-shell-nav-item">
              <span className="app-shell-nav-icon">▣</span>
              <span className="app-shell-nav-text">Cases</span>
            </a>

            <a href="/specimens" className="app-shell-nav-item">
              <span className="app-shell-nav-icon">◈</span>
              <span className="app-shell-nav-text">Workflow</span>
            </a>

            <a href="/reports" className="app-shell-nav-item">
              <span className="app-shell-nav-icon">▤</span>
              <span className="app-shell-nav-text">Review & Reports</span>
            </a>
          </div>

          <div className="app-shell-nav-section">
            <span className="app-shell-nav-label">Quality</span>

            <a href="/qc" className="app-shell-nav-item">
              <span className="app-shell-nav-icon">✓</span>
              <span className="app-shell-nav-text">Quality Control</span>
            </a>

            <a href="/tat" className="app-shell-nav-item">
              <span className="app-shell-nav-icon">◷</span>
              <span className="app-shell-nav-text">TAT & Performance</span>
            </a>
          </div>

          <div className="app-shell-nav-section">
            <span className="app-shell-nav-label">Intelligence</span>

            <a href="/dashboard" className="app-shell-nav-item">
              <span className="app-shell-nav-icon">✦</span>
              <span className="app-shell-nav-text">AI Insights</span>
            </a>

            <a href="/audit-logs" className="app-shell-nav-item">
              <span className="app-shell-nav-icon">◫</span>
              <span className="app-shell-nav-text">Activity & Audit</span>
            </a>
          </div>
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

            <div className="app-shell-search">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search cases, patients, slides..."
                aria-label="Search"
              />
              <kbd>⌘ K</kbd>
            </div>
          </div>

          <div className="app-shell-topbar-actions">
            <button type="button" className="app-shell-icon-button">
              Notifications
            </button>

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
