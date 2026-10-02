import React, { useState } from "react";
import { Outlet } from "react-router-dom";

const AppShell = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

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
              <div className="app-shell-user-avatar">U</div>

              <div>
                <strong>User</strong>
                <span>Laboratory Staff</span>
              </div>
            </div>
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