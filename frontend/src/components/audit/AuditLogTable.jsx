import React from "react";

const AuditLogTable = ({ logs = [] }) => {
  if (!logs.length) {
    return (
      <div className="audit-log-empty">
        <h3>No audit records found</h3>
        <p>Audit activity will appear here when records are available.</p>
      </div>
    );
  }

  return (
    <div className="audit-log-table-wrapper">
      <table className="audit-log-table">
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>User</th>
            <th>Role</th>
            <th>Action</th>
            <th>Module</th>
            <th>Record ID</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.timestamp || "-"}</td>
              <td>{log.user || "-"}</td>
              <td>{log.role || "-"}</td>
              <td>{log.action || "-"}</td>
              <td>{log.module || "-"}</td>
              <td>{log.recordId || "-"}</td>
              <td>{log.description || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogTable;