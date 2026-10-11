import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Fingerprint,
  ShieldCheck,
  UserRound,
  Activity,
  LockKeyhole,
} from "lucide-react";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import { getAllUsers } from "../../services/userService";
import "./account-overview.css";

const ROLE_DETAILS = {
  ADMIN: {
    label: "System Administrator",
    description: "User administration and system-level management.",
    permissions: [
      "Access user management",
      "Manage staff accounts",
      "Access authorized administration features",
    ],
  },
  PATHOLOGIST: {
    label: "Pathologist",
    description: "Case review and pathology report responsibilities.",
    permissions: [
      "Review assigned cases",
      "Access pathology review workflows",
      "Perform permitted report actions",
    ],
  },
  TECHNICIAN: {
    label: "Laboratory Technician",
    description: "Laboratory processing and specimen workflow responsibilities.",
    permissions: [
      "Access permitted laboratory workflows",
      "Update assigned processing steps",
      "Record specimen handling activities",
    ],
  },
  QUALITY_MANAGER: {
    label: "Quality Manager",
    description: "Quality assurance and laboratory compliance responsibilities.",
    permissions: [
      "Review quality records",
      "Access permitted quality-control workflows",
      "Review audit information",
    ],
  },
};

const AccountOverview = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getAllUsers()
      .then(({ users = [] }) => {
        if (isMounted) {
          setUser(users.find((record) => (record.id || record._id) === id) || null);
        }
      })
      .catch((requestError) => {
        if (isMounted) setError(requestError.message || "Unable to load this account.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [id]);

  const role = user ? ROLE_DETAILS[user.role] : null;
  const joined = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Not available";

  return (
    <div className="account-overview-page">
      <DashboardHeader />

      <main className="account-overview-content">
        <Link to={`/users/${id}`} className="ao-back-link">
          <ArrowLeft size={17} />
          Back to staff profile
        </Link>

        <div className="ao-heading">
          <div>
            <span className="ao-eyebrow">USER MANAGEMENT / ACCOUNT</span>
            <h1>Account overview</h1>
            <p>
              Review account identity, role assignment and access information.
            </p>
          </div>
          <div className="ao-heading-icon">
            <Fingerprint size={26} />
          </div>
        </div>

        {loading ? (
          <section className="ao-card" role="status">Loading account overview…</section>
        ) : error || !user || !role ? (
          <section className="ao-card ao-not-found">
            <UserRound size={26} />
            <h2>{error ? "Unable to load account" : "Account not found"}</h2>
            <p>{error || `No user account was found for identifier ${id}.`}</p>
            <Link to="/users" className="ao-primary-link">
              Return to user management
            </Link>
          </section>
        ) : (
          <>
            <section className="ao-identity-card">
              <div className="ao-avatar">
                {user.name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()}
              </div>

              <div className="ao-identity-main">
                <span className="ao-eyebrow">STAFF ACCOUNT</span>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <div className="ao-tags">
                  <span className="ao-tag">{id}</span>
                  <span className="ao-tag">{user.role.replaceAll("_", " ")}</span>
                </div>
              </div>

              <span className="ao-status">
                <span />
                {user.status}
              </span>
            </section>

            <div className="ao-stat-grid">
              <section className="ao-stat-card">
                <div className="ao-stat-icon blue">
                  <UserRound size={19} />
                </div>
                <span>Account identifier</span>
                <strong>{id}</strong>
                <small>Staff directory reference</small>
              </section>

              <section className="ao-stat-card">
                <div className="ao-stat-icon violet">
                  <ShieldCheck size={19} />
                </div>
                <span>Assigned role</span>
                <strong>{role.label}</strong>
                <small>Assigned to this staff account</small>
              </section>

              <section className="ao-stat-card">
                <div className="ao-stat-icon green">
                  <CalendarDays size={19} />
                </div>
                <span>Date joined</span>
                <strong>{joined}</strong>
                <small>Account creation date</small>
              </section>
            </div>

            <section className="ao-card">
              <div className="ao-section-heading">
                <div className="ao-section-icon">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2>Role and access</h2>
                  <p>{role.description}</p>
                </div>
              </div>

              <div className="ao-role-banner">
                <div className="ao-role-symbol">
                  <LockKeyhole size={21} />
                </div>
                <div>
                  <span>ROLE ASSIGNMENT</span>
                  <h3>{role.label}</h3>
                  <p>{user.role.replaceAll("_", " ")}</p>
                </div>
              </div>

              <h3 className="ao-subheading">Role responsibilities</h3>
              <div className="ao-permission-list">
                {role.permissions.map((permission) => (
                  <div className="ao-permission" key={permission}>
                    <ShieldCheck size={17} />
                    <span>{permission}</span>
                  </div>
                ))}
              </div>

              <p className="ao-disclaimer">
                <LockKeyhole size={15} />
                These descriptions are informational. Actual authorization is
                enforced by the application's backend and route protection.
              </p>
            </section>

            <section className="ao-card ao-activity-card">
              <div className="ao-section-heading">
                <div className="ao-section-icon">
                  <Activity size={20} />
                </div>
                <div>
                  <h2>Account activity</h2>
                  <p>Account activity information and audit history.</p>
                </div>
              </div>

              <div className="ao-empty-activity">
                <Clock3 size={23} />
                <div>
                  <strong>Activity history is not connected yet</strong>
                  <p>
                    Login timestamps and account audit events will appear here
                    once this page is connected to the backend.
                  </p>
                </div>
              </div>
            </section>

            <div className="ao-footer-note">
              <ShieldCheck size={18} />
              <p>
                <strong>Account information</strong>
                <span>
                  Account identity and role data are loaded from the protected
                  user directory.
                </span>
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AccountOverview;
