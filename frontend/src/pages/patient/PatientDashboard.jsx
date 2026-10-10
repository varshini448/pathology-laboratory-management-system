import { useEffect, useState } from "react";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import DashboardStatCard from "../dashboard/components/DashboardStatCard";
import DashboardSection from "../dashboard/components/DashboardSection";
import { getPatientDashboard } from "../../services/externalDashboardService";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString();
};

const PatientDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getPatientDashboard()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (active) {
          setError(
            err?.message ||
              "Unable to load your dashboard. Please try again."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = data?.stats || {};
  const cases = data?.cases || [];
  const reports = data?.reports || [];

  return (
    <main className="dashboard-page">
      <DashboardHeader
        title="Patient Dashboard"
        subtitle="View your pathology cases, progress, and finalized reports."
        userName={data?.account?.name}
        role="PATIENT"
      />

      {loading && (
        <p role="status" aria-live="polite">
          Loading your pathology information…
        </p>
      )}

      {error && !loading && (
        <div className="dashboard-empty-state" role="alert">
          <h3>Dashboard unavailable</h3>
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="dashboard-stat-grid" aria-label="Patient statistics">
            <DashboardStatCard
              title="My Cases"
              value={stats.totalCases ?? 0}
              subtitle="Cases registered to your account"
              icon="📋"
            />
            <DashboardStatCard
              title="Active Cases"
              value={stats.activeCases ?? 0}
              subtitle="Currently in progress"
              icon="🔬"
            />
            <DashboardStatCard
              title="Final Reports"
              value={stats.finalReports ?? 0}
              subtitle="Reports signed out and available"
              icon="📄"
            />
          </section>

          <DashboardSection
            title="My Pathology Cases"
            subtitle="Only cases associated with your account are shown."
          >
            {cases.length === 0 ? (
              <div className="dashboard-empty-state">
                <h3>No cases found</h3>
                <p>Cases registered to your account will appear here.</p>
              </div>
            ) : (
              <div className="dashboard-table-wrapper">
                <table className="dashboard-data-table">
                  <thead>
                    <tr>
                      <th>Case ID</th>
                      <th>Case Type</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((item) => (
                      <tr key={item._id}>
                        <td>{item.caseId}</td>
                        <td>{item.caseType || "—"}</td>
                        <td>{item.status || "—"}</td>
                        <td>{item.priority || "—"}</td>
                        <td>{formatDate(item.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DashboardSection>

          <DashboardSection
            title="Finalized Reports"
            subtitle="Only finalized reports are included in this patient view."
          >
            {reports.length === 0 ? (
              <div className="dashboard-empty-state">
                <h3>No finalized reports yet</h3>
                <p>
                  Reports will appear here after the laboratory finalizes
                  and signs them out.
                </p>
              </div>
            ) : (
              <div className="dashboard-table-wrapper">
                <table className="dashboard-data-table">
                  <thead>
                    <tr>
                      <th>Report ID</th>
                      <th>Case ID</th>
                      <th>Diagnosis</th>
                      <th>Finalized</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report._id}>
                        <td>{report.reportId}</td>
                        <td>{report.case?.caseId || "—"}</td>
                        <td>{report.diagnosis || "—"}</td>
                        <td>{formatDate(report.reviewedAt || report.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DashboardSection>
        </>
      )}
    </main>
  );
};

export default PatientDashboard;
