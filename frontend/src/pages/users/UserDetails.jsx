import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  ShieldCheck,
  Stethoscope,
  UserRound,
  UserRoundCheck,
} from "lucide-react";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import { getAllUsers } from "../../services/userService";
import "./user-details.css";

const ROLE_DETAILS = {
  ADMIN: {
    label: "Administrator",
    description: "System administration and user access management",
    icon: ShieldCheck,
    className: "admin",
  },
  PATHOLOGIST: {
    label: "Pathologist",
    description: "Case review and pathology report responsibilities",
    icon: Stethoscope,
    className: "pathologist",
  },
  TECHNICIAN: {
    label: "Lab Technician",
    description: "Specimen processing and laboratory workflow",
    icon: UserRoundCheck,
    className: "technician",
  },
  QUALITY_MANAGER: {
    label: "Quality Manager",
    description: "Quality assurance and compliance oversight",
    icon: CheckCircle2,
    className: "quality",
  },
};

const UserDetails = () => {
  const { id: userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getAllUsers()
      .then(({ users = [] }) => {
        if (isMounted) {
          setUser(users.find((record) => (record.id || record._id) === userId) || null);
        }
      })
      .catch((requestError) => {
        if (isMounted) setError(requestError.message || "Unable to load this user.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [userId]);

  const accountId = user?.id || user?._id || userId;
  const role = ROLE_DETAILS[user?.role] || ROLE_DETAILS.TECHNICIAN;
  const RoleIcon = role.icon;
  const initials = (user?.name || "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <main className="dashboard-page user-details-page">
      <DashboardHeader
        title="Staff Profile"
        subtitle="View staff identity, laboratory responsibilities, and account access."
        actions={
          <Link to="/users" className="ud-back-button">
            <ArrowLeft size={16} />
            <span>Back to users</span>
          </Link>
        }
      />

      <div className="ud-breadcrumb">
        <Link to="/users">User Management</Link>
        <span>/</span>
        <span>Staff Profile</span>
      </div>

      {loading || error || !user ? (
        <section className="ud-panel" role={error ? "alert" : "status"}>
          {loading ? "Loading staff profile…" : error || "User not found."}
        </section>
      ) : (
        <>
      <section className="ud-profile-card">
        <div className="ud-profile-banner">
          <div className="ud-banner-pattern" />
          <span className="ud-profile-label">
            <ShieldCheck size={14} />
            STAFF ACCOUNT
          </span>
        </div>

        <div className="ud-profile-main">
          <div className={`ud-avatar ud-avatar-${role.className}`}>
            {initials || <UserRound size={32} />}
          </div>

          <div className="ud-profile-copy">
            <div className="ud-name-line">
              <h2>{user.name}</h2>
              <span className="ud-status">
                <span />
                {user.status || "Unknown"}
              </span>
            </div>
            <p className="ud-profile-email">
              <Mail size={15} />
              {user.email}
            </p>
            <div className="ud-profile-meta">
              <span className="ud-id-chip">{accountId}</span>
              <span className={`ud-role-badge ud-role-${role.className}`}>
                <RoleIcon size={14} />
                {role.label}
              </span>
            </div>
          </div>
        </div>

        <div className="ud-profile-footer">
          <div>
            <span className="ud-footer-label">Account status</span>
            <strong><CheckCircle2 size={15} /> {user.status || "Unknown"} account</strong>
          </div>
          <div>
            <span className="ud-footer-label">Assigned role</span>
            <strong><ShieldCheck size={15} /> {role.label}</strong>
          </div>
          <div>
            <span className="ud-footer-label">Member since</span>
            <strong><CalendarDays size={15} /> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Not available"}</strong>
          </div>
        </div>
      </section>

      <div className="ud-content-grid">
        <section className="ud-panel">
          <div className="ud-panel-heading">
            <div className="ud-panel-icon"><UserRound size={18} /></div>
            <div>
              <h3>Personal information</h3>
              <p>Contact information associated with this account.</p>
            </div>
          </div>

          <div className="ud-detail-list">
            <div className="ud-detail-row">
              <span className="ud-detail-icon"><UserRound size={16} /></span>
              <div>
                <span className="ud-detail-label">Full name</span>
                <strong>{user.name}</strong>
              </div>
            </div>
            <div className="ud-detail-row">
              <span className="ud-detail-icon"><Mail size={16} /></span>
              <div>
                <span className="ud-detail-label">Email address</span>
                <strong className="ud-break-word">{user.email}</strong>
              </div>
            </div>
            <div className="ud-detail-row">
              <span className="ud-detail-icon"><Phone size={16} /></span>
              <div>
                <span className="ud-detail-label">Phone number</span>
                <strong>{user.phone}</strong>
              </div>
            </div>
            <div className="ud-detail-row">
              <span className="ud-detail-icon"><CalendarDays size={16} /></span>
              <div>
                <span className="ud-detail-label">Date joined</span>
                <strong>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Not available"}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="ud-panel">
          <div className="ud-panel-heading">
            <div className="ud-panel-icon"><ShieldCheck size={18} /></div>
            <div>
              <h3>Role & access</h3>
              <p>Responsibilities assigned to this staff account.</p>
            </div>
          </div>

          <div className={`ud-role-feature ud-role-feature-${role.className}`}>
            <div className="ud-role-feature-icon"><RoleIcon size={23} /></div>
            <div>
              <span className="ud-detail-label">Assigned role</span>
              <h4>{role.label}</h4>
              <p>{role.description}</p>
            </div>
          </div>

          <div className="ud-access-note">
            <ShieldCheck size={18} />
            <div>
              <strong>Role-based access control</strong>
              <p>Available actions should be restricted according to the permissions configured for this role.</p>
            </div>
          </div>

          <div className="ud-panel-link-row">
            <span>Account identifier</span>
            <strong>{accountId}</strong>
          </div>
        </section>
      </div>

      <Link
        to={`/users/${userId}/account`}
        className="ud-security-strip ud-account-overview-link"
        aria-label="Open account overview"
      >
        <div className="ud-security-icon"><Clock3 size={18} /></div>
        <div>
          <strong>Account overview</strong>
          <p>Review account identity, role assignment and access information.</p>
        </div>
        <ArrowUpRight className="ud-security-arrow" size={19} />
      </Link>
        </>
      )}
    </main>
  );
};

export default UserDetails;
