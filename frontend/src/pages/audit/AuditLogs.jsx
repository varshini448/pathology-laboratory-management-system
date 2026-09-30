import React, { useMemo, useState } from "react";
import AuditLogTable from "../../components/audit/AuditLogTable";

const DEMO_AUDIT_LOGS = [
  {
    id: "AUD001",
    timestamp: "30 Sep 2026, 10:42 AM",
    user: "Admin User",
    role: "ADMIN",
    action: "CREATE",
    module: "Patient",
    recordId: "PAT001",
    description: "Patient record created",
  },
  {
    id: "AUD002",
    timestamp: "30 Sep 2026, 10:35 AM",
    user: "Dr. Priya Sharma",
    role: "PATHOLOGIST",
    action: "UPDATE",
    module: "Case",
    recordId: "CASE001",
    description: "Case information updated",
  },
  {
    id: "AUD003",
    timestamp: "30 Sep 2026, 10:18 AM",
    user: "Lab Technician",
    role: "TECHNICIAN",
    action: "UPDATE",
    module: "Specimen",
    recordId: "SPEC001",
    description: "Specimen status changed to Accessioned",
  },
  {
    id: "AUD004",
    timestamp: "30 Sep 2026, 09:56 AM",
    user: "Dr. Priya Sharma",
    role: "PATHOLOGIST",
    action: "CREATE",
    module: "Report",
    recordId: "REP-1790054926037",
    description: "Pathology report created",
  },
  {
    id: "AUD005",
    timestamp: "30 Sep 2026, 09:30 AM",
    user: "Quality Manager",
    role: "QUALITY_MANAGER",
    action: "UPDATE",
    module: "QC",
    recordId: "QC001",
    description: "Quality control record reviewed",
  },
];

const AuditLogs = () => {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");

  const filteredLogs = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return DEMO_AUDIT_LOGS.filter((log) => {
      const matchesSearch =
        !searchValue ||
        Object.values(log).some((value) =>
          String(value).toLowerCase().includes(searchValue)
        );

      const matchesModule =
        moduleFilter === "ALL" || log.module === moduleFilter;

      const matchesAction =
        actionFilter === "ALL" || log.action === actionFilter;

      return matchesSearch && matchesModule && matchesAction;
    });
  }, [search, moduleFilter, actionFilter]);

  return (
    <main className="audit-logs-page">
      <header className="audit-page-header">
        <div>
          <p className="audit-eyebrow">SYSTEM GOVERNANCE</p>
          <h1>Audit Logs</h1>
          <p>
            Monitor important activity performed across the pathology
            laboratory system.
          </p>
        </div>
      </header>

      <section className="audit-summary">
        <div className="audit-summary-card">
          <span>Total Events</span>
          <strong>{DEMO_AUDIT_LOGS.length}</strong>
        </div>

        <div className="audit-summary-card">
          <span>Patient Activity</span>
          <strong>
            {DEMO_AUDIT_LOGS.filter((log) => log.module === "Patient").length}
          </strong>
        </div>

        <div className="audit-summary-card">
          <span>Report Activity</span>
          <strong>
            {DEMO_AUDIT_LOGS.filter((log) => log.module === "Report").length}
          </strong>
        </div>

        <div className="audit-summary-card">
          <span>Updates</span>
          <strong>
            {DEMO_AUDIT_LOGS.filter((log) => log.action === "UPDATE").length}
          </strong>
        </div>
      </section>

      <section className="audit-filters">
        <input
          type="search"
          placeholder="Search audit records..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search audit records"
        />

        <select
          value={moduleFilter}
          onChange={(event) => setModuleFilter(event.target.value)}
          aria-label="Filter by module"
        >
          <option value="ALL">All Modules</option>
          <option value="Patient">Patient</option>
          <option value="Case">Case</option>
          <option value="Specimen">Specimen</option>
          <option value="Report">Report</option>
          <option value="QC">QC</option>
        </select>

        <select
          value={actionFilter}
          onChange={(event) => setActionFilter(event.target.value)}
          aria-label="Filter by action"
        >
          <option value="ALL">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
          <option value="LOGIN">Login</option>
        </select>
      </section>

      <section className="audit-table-card">
        <div className="audit-table-header">
          <div>
            <h2>Activity History</h2>
            <p>{filteredLogs.length} records displayed</p>
          </div>
        </div>

        <AuditLogTable logs={filteredLogs} />
      </section>
    </main>
  );
};

export default AuditLogs;