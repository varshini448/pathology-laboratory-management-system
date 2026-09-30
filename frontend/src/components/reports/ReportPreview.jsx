import React from "react";

const ReportPreview = ({ report = {} }) => {
  return (
    <article className="report-preview">
      <header className="report-preview-header">
        <div>
          <p>PATHOLOGY LABORATORY</p>
          <h2>Diagnostic Report</h2>
        </div>

        <span className={`report-preview-status report-status-${(
          report.reportStatus || "DRAFT"
        ).toLowerCase()}`}>
          {report.reportStatus || "DRAFT"}
        </span>
      </header>

      <section className="report-preview-section">
        <div>
          <span>Report ID</span>
          <strong>{report.reportId || "-"}</strong>
        </div>

        <div>
          <span>Case ID</span>
          <strong>{report.caseId || "-"}</strong>
        </div>

        <div>
          <span>Patient</span>
          <strong>{report.patientName || "-"}</strong>
        </div>
      </section>

      <section className="report-preview-section report-preview-body">
        <div>
          <h3>Diagnosis</h3>
          <p>{report.diagnosis || "No diagnosis entered."}</p>
        </div>

        <div>
          <h3>Microscopic Findings</h3>
          <p>{report.microscopicFindings || "-"}</p>
        </div>

        <div>
          <h3>Gross Findings</h3>
          <p>{report.grossFindings || "-"}</p>
        </div>

        <div>
          <h3>Interpretation</h3>
          <p>{report.interpretation || "-"}</p>
        </div>

        <div>
          <h3>Recommendations</h3>
          <p>{report.recommendations || "-"}</p>
        </div>
      </section>
    </article>
  );
};

export default ReportPreview;