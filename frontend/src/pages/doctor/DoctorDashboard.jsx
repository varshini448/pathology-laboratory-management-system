import { useEffect, useState } from "react";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import DashboardStatCard from "../dashboard/components/DashboardStatCard";
import DashboardSection from "../dashboard/components/DashboardSection";
import { getDoctorDashboard } from "../../services/externalDashboardService";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString();
};

const DoctorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getDoctorDashboard()
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
        title="Doctor Dashboard"
        subtitle="Monitor your assigned pathology cases and reports."
        userName={data?.account?.name}
        role={data?.account?.specialization || "DOCTOR"}
      />

      {loading && (
        <p role="status" aria-live="polite">
          Loading your clinical workspace…
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
          <section className="dashboard-stat-grid" aria-label="Doctor statistics">
            <DashboardStatCard
              title="Assigned Cases"
              value={stats.assignedCases ?? 0}
              subtitle="Cases assigned to you"
              icon="📋"
            />
            <DashboardStatCard
              title="Patients"
              value={stats.distinctPatients ?? 0}
              subtitle="Distinct patients in your assigned cases"
              icon="👤"
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
              subtitle="Finalized reports for your cases"
              icon="📄"
            />
          </section>

          <DashboardSection
            title="Assigned Cases"
            subtitle="Only cases assigned to your doctor account are shown."
          >
            {cases.length === 0 ? (
              <div className="dashboard-empty-state">
                <h3>No assigned cases</h3>
                <p>Cases assigned to you will appear here.</p>
              </div>
            ) : (
              <div className="dashboard-table-wrapper">
                <table className="dashboard-data-table">
                  <thead>
                    <tr>
                      <th>Case ID</th>
                      <th>Patient</th>
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
                        <td>{item.patient?.name || "—"}</td>
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
            title="Reports for Assigned Cases"
            subtitle="Drafts and finalized reports are labeled by their current status."
          >
            {reports.length === 0 ? (
              <div className="dashboard-empty-state">
                <h3>No reports available</h3>
                <p>Reports associated with your assigned cases will appear here.</p>
              </div>
            ) : (
              <div className="dashboard-table-wrapper">
                <table className="dashboard-data-table">
                  <thead>
                    <tr>
                      <th>Report ID</th>
                      <th>Case ID</th>
                      <th>Status</th>
                      <th>Diagnosis</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report._id}>
                        <td>{report.reportId}</td>
                        <td>{report.case?.caseId || "—"}</td>
                        <td>{report.reportStatus || "—"}</td>
                        <td>{report.diagnosis || "—"}</td>
                        <td>{formatDate(report.createdAt)}</td>
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

export default DoctorDashboard;
