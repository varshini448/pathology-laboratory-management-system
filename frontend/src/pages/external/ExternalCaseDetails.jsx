import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileCheck2 } from "lucide-react";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import DashboardSection from "../dashboard/components/DashboardSection";
import { getDoctorDashboard, getPatientDashboard } from "../../services/externalDashboardService";
import "../dashboard/dashboard.css";
import "./external-case-details.css";

const ExternalCaseDetails = ({ accountType }) => {
  const { caseId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isDoctor = accountType === "doctor";
  const dashboardPath = isDoctor ? "/doctor-dashboard" : "/patient-dashboard";

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    const loadDashboard = isDoctor ? getDoctorDashboard : getPatientDashboard;
    loadDashboard()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (active) setError(err?.message || "Unable to load this case.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [caseId, isDoctor]);

  const caseRecord = data?.cases?.find((item) => item.caseId === caseId);
  const reports = caseRecord
    ? (data?.reports || []).filter((report) => report.case?.caseId === caseRecord.caseId)
    : [];

  return (
    <main className="dashboard-page">
      <DashboardHeader
        title={isDoctor ? "Assigned Case Details" : "My Case Details"}
        subtitle="Case information is limited to records available to your account."
      />

      <Link to={dashboardPath} className="dashboard-refresh-action">
        <ArrowLeft size={15} aria-hidden="true" /> Back to overview
      </Link>

      {loading && <p role="status" aria-live="polite">Loading case details…</p>}
      {error && !loading && <div role="alert" className="dashboard-empty-state"><p>{error}</p></div>}
      {!loading && !error && !caseRecord && (
        <div className="dashboard-empty-state" role="status">
          <h2>Case not found</h2>
          <p>This case is not available to your account.</p>
        </div>
      )}

      {!loading && !error && caseRecord && (
        <>
          <DashboardSection title={caseRecord.caseId} subtitle="Case overview">
            <dl className="external-case-details-grid">
              <div><dt>Case type</dt><dd>{caseRecord.caseType || "—"}</dd></div>
              <div><dt>Status</dt><dd>{caseRecord.status || "—"}</dd></div>
              <div><dt>Priority</dt><dd>{caseRecord.priority || "—"}</dd></div>
              <div><dt>Registered</dt><dd>{caseRecord.createdAt ? new Date(caseRecord.createdAt).toLocaleDateString() : "—"}</dd></div>
              {isDoctor && <div><dt>Patient</dt><dd>{caseRecord.patient?.name || "—"}</dd></div>}
            </dl>
          </DashboardSection>

          <DashboardSection title="Finalized Reports" subtitle="Only reports finalized for this case are shown.">
            {reports.length === 0 ? (
              <div className="dashboard-empty-state"><p>No finalized report is available yet.</p></div>
            ) : reports.map((report) => (
              <article key={report._id} className="external-case-report">
                <h3><FileCheck2 size={18} aria-hidden="true" /> {report.reportId}</h3>
                <p><strong>Diagnosis</strong></p>
                <p>{report.diagnosis || "No report summary is available."}</p>
                {report.microscopicFindings && <><p><strong>Microscopic findings</strong></p><p>{report.microscopicFindings}</p></>}
                {report.grossFindings && <><p><strong>Gross findings</strong></p><p>{report.grossFindings}</p></>}
                {report.interpretation && <><p><strong>Interpretation</strong></p><p>{report.interpretation}</p></>}
                {report.recommendations && <><p><strong>Recommendations</strong></p><p>{report.recommendations}</p></>}
              </article>
            ))}
          </DashboardSection>
        </>
      )}
    </main>
  );
};

export default ExternalCaseDetails;
