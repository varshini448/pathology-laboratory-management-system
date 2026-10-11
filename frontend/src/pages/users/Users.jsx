import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  UserPlus,
  Users as UsersIcon,
  ShieldCheck,
  Stethoscope,
  FlaskConical,
  ClipboardCheck,
  ArrowUpRight,
  SlidersHorizontal,
  UserRound,
  ChevronRight,
  X,
} from "lucide-react";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import { getAllUsers } from "../../services/userService";
import "./users.css";

const ROLE_DETAILS = {
  ADMIN: { label: "Administrator", className: "admin", icon: ShieldCheck },
  PATHOLOGIST: { label: "Pathologist", className: "pathologist", icon: Stethoscope },
  TECHNICIAN: { label: "Technician", className: "technician", icon: FlaskConical },
  QUALITY_MANAGER: { label: "Quality Manager", className: "quality", icon: ClipboardCheck },
};

const Users = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getAllUsers();
        const records = Array.isArray(result?.users) ? result.users : [];

        if (isMounted) {
          setUsers(records.map((user) => ({
            ...user,
            id: user.id || user._id?.toString() || "",
            name: user.name || "Unnamed user",
            email: user.email || "No email available",
            role: user.role || "UNKNOWN",
            status: user.status || "UNKNOWN",
          })));
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Unable to load the staff directory.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadUsers();
    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  const filteredUsers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        !searchValue ||
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        user.id.toLowerCase().includes(searchValue);

      const matchesRole =
        roleFilter === "ALL" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const activeCount = users.filter(
    (user) => user.status === "ACTIVE"
  ).length;

  const roleCount = (role) =>
    users.filter((user) => user.role === role).length;

  return (
    <main className="dashboard-page users-page">
      <DashboardHeader
        title="User Management"
        subtitle="Manage laboratory access, staff identities, and role assignments."
        actions={
          <Link to="/users/add" className="users-primary-action">
            <UserPlus size={17} />
            <span>Add user</span>
          </Link>
        }
      />

      <section className="users-welcome-strip">
        <div className="users-welcome-icon">
          <ShieldCheck size={23} />
        </div>
        <div>
          <strong>Laboratory access directory</strong>
          <p>Review staff accounts and their assigned responsibilities.</p>
        </div>
        <span className="users-directory-tag">
          <span className="users-live-dot" />
          Staff directory
        </span>
      </section>

      <section className="users-summary-grid" aria-label="User summary">
        <article className="users-summary-card">
          <div className="users-summary-top">
            <span className="users-summary-icon users-icon-blue">
              <UsersIcon size={20} />
            </span>
            <span className="users-summary-caption">Directory</span>
          </div>
          <strong className="users-summary-value">{users.length}</strong>
          <span className="users-summary-label">Total staff accounts</span>
        </article>

        <article className="users-summary-card">
          <div className="users-summary-top">
            <span className="users-summary-icon users-icon-green">
              <ShieldCheck size={20} />
            </span>
            <span className="users-summary-caption">Account status</span>
          </div>
          <strong className="users-summary-value">{activeCount}</strong>
          <span className="users-summary-label">Active accounts</span>
        </article>

        <article className="users-summary-card">
          <div className="users-summary-top">
            <span className="users-summary-icon users-icon-purple">
              <Stethoscope size={20} />
            </span>
            <span className="users-summary-caption">Clinical team</span>
          </div>
          <strong className="users-summary-value">
            {roleCount("PATHOLOGIST")}
          </strong>
          <span className="users-summary-label">Pathologists</span>
        </article>

        <article className="users-summary-card">
          <div className="users-summary-top">
            <span className="users-summary-icon users-icon-amber">
              <ClipboardCheck size={20} />
            </span>
            <span className="users-summary-caption">Quality & operations</span>
          </div>
          <strong className="users-summary-value">
            {roleCount("TECHNICIAN") + roleCount("QUALITY_MANAGER")}
          </strong>
          <span className="users-summary-label">Operations and quality staff</span>
        </article>
      </section>

      <section className="users-directory-section">
        <div className="users-directory-header">
          <div>
            <span className="users-section-eyebrow">ACCESS ADMINISTRATION</span>
            <h2>Staff directory</h2>
            <p>Search accounts and review assigned laboratory roles.</p>
          </div>
          <span className="users-result-count">
            {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"}
          </span>
        </div>

        <div className="users-toolbar">
          <label className="users-search-box">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search name, email or user ID..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search users"
            />
            {search && (
              <button
                type="button"
                className="users-clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </label>

          <label className="users-role-filter">
            <SlidersHorizontal size={16} aria-hidden="true" />
            <span className="users-filter-label">Role</span>
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              aria-label="Filter users by role"
            >
              <option value="ALL">All roles</option>
              <option value="ADMIN">Administrator</option>
              <option value="TECHNICIAN">Technician</option>
              <option value="PATHOLOGIST">Pathologist</option>
              <option value="QUALITY_MANAGER">Quality Manager</option>
            </select>
          </label>
        </div>

        <div className="users-table-scroll">
          <table className="users-table">
            <thead>
              <tr>
                <th scope="col">User</th>
                <th scope="col">User ID</th>
                <th scope="col">Assigned role</th>
                <th scope="col">Status</th>
                <th scope="col" className="users-action-heading">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const role = ROLE_DETAILS[user.role] || {
                  label: user.role,
                  className: "default",
                  icon: UserRound,
                };
                const RoleIcon = role.icon;

                return (
                  <tr key={user.id}>
                    <td>
                      <div className="users-identity">
                        <span className={`users-avatar users-avatar-${role.className}`}>
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="users-identity-copy">
                          <strong>{user.name}</strong>
                          <span>{user.email}</span>
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="users-id">{user.id}</span>
                    </td>
                    <td>
                      <span className={`users-role-badge users-role-${role.className}`}>
                        <RoleIcon size={14} />
                        {role.label}
                      </span>
                    </td>
                    <td>
                      <span className={`users-status users-status-${user.status.toLowerCase()}`}>
                        <span />
                        {user.status === "ACTIVE" ? "Active" : user.status}
                      </span>
                    </td>
                    <td className="users-action-cell">
                      <Link
                        to={`/users/${user.id}`}
                        className="users-view-link"
                        aria-label={`View ${user.name}`}
                      >
                        View details
                        <ChevronRight size={15} />
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {loading && (
                <tr><td colSpan="5">
                  <div className="users-empty-state" role="status">
                    <strong>Loading staff directory…</strong>
                    <p>Retrieving current laboratory user accounts.</p>
                  </div>
                </td></tr>
              )}

              {!loading && error && (
                <tr><td colSpan="5">
                  <div className="users-empty-state" role="alert">
                    <strong>Unable to load staff directory</strong>
                    <p>{error}</p>
                    <button type="button"
                      onClick={() => setReloadKey((key) => key + 1)}>
                      Try again
                    </button>
                  </div>
                </td></tr>
              )}

              {!loading && !error && filteredUsers.length === 0 && (
                <tr><td colSpan="5">
                  <div className="users-empty-state">
                    <span className="users-empty-icon">
                      <Search size={23} />
                    </span>
                    <strong>
                      {users.length === 0
                        ? "No staff accounts found"
                        : "No matching users"}
                    </strong>
                    <p>
                      {users.length === 0
                        ? "No user accounts are currently available in the directory."
                        : "Try another search term or change the selected role."}
                    </p>
                    {(search || roleFilter !== "ALL") && (
                      <button type="button" onClick={() => {
                        setSearch("");
                        setRoleFilter("ALL");
                      }}>
                        Clear filters
                      </button>
                    )}
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="users-table-footer">
          <span>
            Showing <strong>{filteredUsers.length}</strong> of{" "}
            <strong>{users.length}</strong> directory entries
          </span>
          <span className="users-footer-note">
            <ShieldCheck size={15} />
            Role-based access control
          </span>
        </footer>
      </section>

      <Link to="/users/access-control" className="users-security-note users-access-control-link" aria-label="Open Access Control">
        <div className="users-security-note-icon">
          <ShieldCheck size={19} />
        </div>
        <div>
          <strong>Access control matters</strong>
          <p>
            Each staff role should have access only to the laboratory
            functions permitted for that role.
          </p>
        </div>
        <ArrowUpRight size={18} className="users-security-arrow" />
      </Link>
    </main>
  );
};

export default Users;
