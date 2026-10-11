import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  Stethoscope,
  FlaskConical,
  ClipboardCheck,
  Users,
  LockKeyhole,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import "./access-control.css";

const ROLES = [
  {
    key: "ADMIN",
    title: "Administrator",
    description: "User administration and system configuration.",
    icon: ShieldCheck,
    permissions: [
      ["User management", true],
      ["Laboratory workflow", true],
      ["Pathologist review", true],
      ["Quality management", true],
      ["System configuration", true],
    ],
  },
  {
    key: "PATHOLOGIST",
    title: "Pathologist",
    description: "Case review, interpretation and report sign-out.",
    icon: Stethoscope,
    permissions: [
      ["User management", false],
      ["Laboratory workflow", true],
      ["Pathologist review", true],
      ["Quality management", false],
      ["System configuration", false],
    ],
  },
  {
    key: "TECHNICIAN",
    title: "Technician",
    description: "Specimen processing and laboratory workflow tasks.",
    icon: FlaskConical,
    permissions: [
      ["User management", false],
      ["Laboratory workflow", true],
      ["Pathologist review", false],
      ["Quality management", false],
      ["System configuration", false],
    ],
  },
  {
    key: "QUALITY_MANAGER",
    title: "Quality Manager",
    description: "Quality assurance, audit oversight and compliance.",
    icon: ClipboardCheck,
    permissions: [
      ["User management", false],
      ["Laboratory workflow", false],
      ["Pathologist review", false],
      ["Quality management", true],
      ["System configuration", false],
    ],
  },
];

const AccessControl = () => {
  return (
    <main className="dashboard-page access-control-page">
      <DashboardHeader />

      <div className="ac-content">
        <Link to="/users" className="ac-back-link">
          <ArrowLeft size={16} />
          Back to User Management
        </Link>

        <section className="ac-heading">
          <div className="ac-heading-icon">
            <ShieldCheck size={25} />
          </div>
          <div>
            <p className="ac-eyebrow">ADMINISTRATION / SECURITY</p>
            <h1>Access Control</h1>
            <p>
              Review role responsibilities and the intended access boundaries
              for the laboratory platform.
            </p>
          </div>
        </section>

        <section className="ac-notice">
          <LockKeyhole size={20} />
          <div>
            <strong>Role-based access overview</strong>
            <p>
              The permissions below are illustrative UI documentation. They do
              not configure or prove backend authorization. Actual access must
              be enforced and verified by the server.
            </p>
          </div>
        </section>

        <section className="ac-role-summary">
          <div>
            <span>Defined roles</span>
            <strong>{ROLES.length}</strong>
          </div>
          <div>
            <span>Permission areas</span>
            <strong>5</strong>
          </div>
          <div>
            <span>Access model</span>
            <strong>RBAC</strong>
          </div>
        </section>

        <section className="ac-permissions-section">
          <div className="ac-section-heading">
            <div>
              <h2>Role permissions matrix</h2>
              <p>Compare the intended permissions for each staff role.</p>
            </div>
            <Users size={21} />
          </div>

          <div className="ac-role-grid">
            {ROLES.map((role) => {
              const RoleIcon = role.icon;

              return (
                <article className="ac-role-card" key={role.key}>
                  <div className={`ac-role-icon ac-${role.key.toLowerCase()}`}>
                    <RoleIcon size={21} />
                  </div>

                  <div className="ac-role-title">
                    <h3>{role.title}</h3>
                    <span>{role.key.replace("_", " ")}</span>
                  </div>

                  <p className="ac-role-description">{role.description}</p>

                  <div className="ac-permission-list">
                    {role.permissions.map(([label, allowed]) => (
                      <div className="ac-permission-row" key={label}>
                        <span>{label}</span>
                        <span
                          className={
                            allowed
                              ? "ac-permission-allowed"
                              : "ac-permission-restricted"
                          }
                        >
                          {allowed ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <XCircle size={16} />
                          )}
                          {allowed ? "Allowed" : "Restricted"}
                        </span>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <footer className="ac-footer">
          <ShieldCheck size={17} />
          Follow least-privilege access and verify permissions against backend
          role policies.
        </footer>
      </div>
    </main>
  );
};

export default AccessControl;
