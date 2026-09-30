import React from "react";

const ReportVersionHistory = ({ versions = [] }) => {
  if (!versions.length) {
    return (
      <div className="report-version-empty">
        No previous report versions available.
      </div>
    );
  }

  return (
    <section className="report-version-history">
      <div className="report-version-header">
        <h3>Version History</h3>
        <span>{versions.length} version(s)</span>
      </div>

      <div className="report-version-list">
        {versions.map((version, index) => (
          <div
            className="report-version-item"
            key={version.id || version.version || index}
          >
            <div>
              <strong>
                Version {version.version || index + 1}
              </strong>

              <span>
                {version.date || "Date unavailable"}
              </span>
            </div>

            <div>
              <span>{version.status || "DRAFT"}</span>
              <small>{version.updatedBy || "Unknown user"}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReportVersionHistory;