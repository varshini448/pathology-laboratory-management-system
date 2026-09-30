import React from "react";

const ReportPrintView = ({ report = {} }) => {
  return (
    <article className="report-print-view">
      <header>
        <p>PATHOLOGY LABORATORY MANAGEMENT SYSTEM</p>
        <h1>PATHOLOGY REPORT</h1>
      </header>

      <section className="print-report-meta">
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

      <section className="print-report-content">
        <h2>Diagnosis</h2>
        <p>{report.diagnosis || "-"}</p>

        <h2>Microscopic Findings</h2>
        <p>{report.microscopicFindings || "-"}</p>

        <h2>Gross Findings</h2>
        <p>{report.grossFindings || "-"}</p>

        <h2>Interpretation</h2>
        <p>{report.interpretation || "-"}</p>

        <h2>Recommendations</h2>
        <p>{report.recommendations || "-"}</p>
      </section>

      <footer>
        <div>
          <span>Prepared By</span>
          <strong>{report.preparedBy || "-"}</strong>
        </div>

        <div>
          <span>Reviewed By</span>
          <strong>{report.reviewedBy || "-"}</strong>
        </div>
      </footer>
    </article>
  );
};

export default ReportPrintView;