import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getReportById } from "../../services/reportService";
import PageHeader from "../../components/layout/PageHeader";
import LoadingState from "../../components/ui/LoadingState";
import ReportPrintView from "../../components/reports/ReportPrintView";

const ReportDetails = () => {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await getReportById(id);
        setReport(data);
      } catch (err) {
        setError(err.message || "Failed to load report");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [id]);

  if (loading) {
    return <main className="report-workspace-page"><LoadingState message="Loading report..." /></main>;
  }

  if (error) {
    return (
      <main className="report-workspace-page">
        <PageHeader eyebrow="PATHOLOGY REPORTING" title="Report details" />
        <p className="workflow-form-error" role="alert">{error}</p>
        <Link className="record-list-action" to="/reports">Back to reports</Link>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="report-workspace-page">
        <PageHeader eyebrow="PATHOLOGY REPORTING" title="Report details" />
        <p role="status">Report not found.</p>
        <Link className="record-list-action" to="/reports">Back to reports</Link>
      </main>
    );
  }

  return (
    <main className="report-workspace-page">
      <PageHeader
        eyebrow="PATHOLOGY REPORTING"
        title="Report details"
        description={`Report ${report.reportId || ""} · ${report.reportStatus || ""}`}
        actions={
          <div className="report-page-actions">
            <Link className="record-list-action" to="/reports">All reports</Link>
            <button type="button" className="record-list-action report-print-button" onClick={() => window.print()}>
              Print / Save as PDF
            </button>
            {report.reportStatus === "DRAFT" && <Link className="record-list-action" to={`/reports/${report._id}/edit`}>Edit draft</Link>}
            {report.reportStatus === "DRAFT" && <Link className="record-list-action" to={`/reports/${report._id}/sign-out`}>Final sign-out</Link>}
          </div>
        }
      />

      <div className="report-screen-details">
      <section className="report-info-panel report-details-panel">

      <p>
        <strong>Report ID:</strong> {report.reportId}
      </p>

      <p>
        <strong>Case:</strong> {report.case?.caseId || "-"}
      </p>

      <p>
        <strong>Slide:</strong> {report.slide?.slideId || "-"}
      </p>

      <p>
        <strong>Diagnosis:</strong> {report.diagnosis}
      </p>

      <p>
        <strong>Microscopic Findings:</strong>{" "}
        {report.microscopicFindings || "-"}
      </p>

      <p>
        <strong>Gross Findings:</strong> {report.grossFindings || "-"}
      </p>

      <p>
        <strong>Interpretation:</strong> {report.interpretation || "-"}
      </p>

      <p>
        <strong>Recommendations:</strong> {report.recommendations || "-"}
      </p>

      <p>
        <strong>Status:</strong> {report.reportStatus}
      </p>

      <p>
        <strong>Prepared By:</strong>{" "}
        {report.preparedBy?.name || "-"}
      </p>

      <p>
        <strong>Reviewed By:</strong>{" "}
        {report.reviewedBy?.name || "-"}
      </p>

      <p>
        <strong>Created At:</strong>{" "}
        {report.createdAt
          ? new Date(report.createdAt).toLocaleString()
          : "-"}
      </p>

      {report.reviewedAt && (
        <p>
          <strong>Reviewed At:</strong>{" "}
          {new Date(report.reviewedAt).toLocaleString()}
        </p>
      )}

      </section>
      </div>

      <div className="report-print-document">
        <ReportPrintView report={{
          reportId: report.reportId,
          caseId: report.case?.caseId,
          slideId: report.slide?.slideId,
          patientName: report.case?.patient?.name || report.patient?.name,
          diagnosis: report.diagnosis,
          microscopicFindings: report.microscopicFindings,
          grossFindings: report.grossFindings,
          interpretation: report.interpretation,
          recommendations: report.recommendations,
          preparedBy: report.preparedBy?.name,
          reviewedBy: report.reviewedBy?.name,
          reviewedAt: report.reviewedAt
            ? new Date(report.reviewedAt).toLocaleString()
            : "-",
          reportStatus: report.reportStatus,
        }} />
      </div>
    </main>
  );
};

export default ReportDetails;
