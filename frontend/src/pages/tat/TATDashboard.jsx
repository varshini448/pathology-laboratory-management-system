import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAllCaseTAT } from "../../services/tatService";

const formatDuration = (minutes) => {
  if (minutes === null || minutes === undefined) {
    return "N/A";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  return `${hours} hr ${remainingMinutes} min`;
};

const getPriorityClass = (priority) => {
  if (priority === "STAT") {
    return "tat-badge tat-badge-stat";
  }

  if (priority === "URGENT") {
    return "tat-badge tat-badge-urgent";
  }

  return "tat-badge tat-badge-normal";
};

const getTATStatusClass = (status) => {
  if (status === "DELAYED") {
    return "tat-status tat-status-delayed";
  }

  if (status === "WITHIN_TAT") {
    return "tat-status tat-status-within";
  }

  if (status === "IN_PROGRESS") {
    return "tat-status tat-status-progress";
  }

  return "tat-status tat-status-progress";
};

const getTATStatusLabel = (status) => {
  if (status === "DELAYED") {
    return "Delayed";
  }

  if (status === "WITHIN_TAT") {
    return "Within TAT";
  }

  return "In Progress";
};

const TATDashboard = () => {
  const [tatData, setTatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTATData = async () => {
      try {
        setLoading(true);

        const data = await getAllCaseTAT();

        setTatData(data);
        setError("");
      } catch (err) {
        console.error("Failed to load TAT data:", err);
        setError(err.message || "Failed to load TAT data");
      } finally {
        setLoading(false);
      }
    };

    loadTATData();
  }, []);

  if (loading) {
    return (
      <div className="tat-page">
        <div className="tat-loading">
          <div className="tat-spinner"></div>
          <p>Loading turnaround time data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tat-page">
        <div className="tat-error">
          <h2>Unable to load TAT data</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const totalCases = tatData.length;

  const completedCases = tatData.filter(
    (caseData) => caseData.isCompleted
  ).length;

  const inProgressCases = tatData.filter(
    (caseData) => !caseData.isCompleted
  ).length;

  return (
    <div className="tat-page">
      {/* Page Header */}
      <div className="tat-page-header">
        <div>
          <p className="tat-eyebrow">LABORATORY OPERATIONS</p>

          <h1>Turnaround Time</h1>

          <p className="tat-page-description">
            Monitor case processing duration and turnaround performance.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="tat-summary-grid">
        <div className="tat-summary-card">
          <div className="tat-summary-icon">▣</div>

          <div>
            <span>Total Cases</span>
            <strong>{totalCases}</strong>
          </div>
        </div>

        <div className="tat-summary-card">
          <div className="tat-summary-icon tat-icon-progress">◷</div>

          <div>
            <span>In Progress</span>
            <strong>{inProgressCases}</strong>
          </div>
        </div>

        <div className="tat-summary-card">
          <div className="tat-summary-icon tat-icon-completed">✓</div>

          <div>
            <span>Completed</span>
            <strong>{completedCases}</strong>
          </div>
        </div>
      </div>

      {/* Case TAT Table */}
      <div className="tat-card">
        <div className="tat-card-header">
          <div>
            <h2>Case Turnaround Overview</h2>

            <p>
              Current processing time for registered laboratory cases.
            </p>
          </div>
        </div>

        {tatData.length === 0 ? (
          <div className="tat-empty">
            <h3>No cases available</h3>

            <p>
              No turnaround time records are currently available.
            </p>
          </div>
        ) : (
          <div className="tat-table-wrapper">
            <table className="tat-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Priority</th>
                  <th>Case Status</th>
                  <th>Current TAT</th>
                  <th>TAT Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {tatData.map((caseData) => (
                  <tr key={caseData.caseId}>
                    <td>
                      <Link
                        className="tat-case-link"
                        to={`/tat/${caseData.caseId}`}
                      >
                        {caseData.caseId}
                      </Link>
                    </td>

                    <td>
                      <div className="tat-patient">
                        <strong>
                          {caseData.patient?.name || "N/A"}
                        </strong>
                      </div>
                    </td>

                    <td>
                      {caseData.doctor?.name || "N/A"}
                    </td>

                    <td>
                      <span
                        className={getPriorityClass(
                          caseData.priority
                        )}
                      >
                        {caseData.priority}
                      </span>
                    </td>

                    <td>
                      <span className="tat-case-status">
                        {caseData.caseStatus || "N/A"}
                      </span>
                    </td>

                    <td>
                      <strong>
                        {formatDuration(caseData.tatMinutes)}
                      </strong>

                      <small className="tat-target-text">
                        Target:{" "}
                        {formatDuration(caseData.targetMinutes)}
                      </small>
                    </td>

                    <td>
                      <span
                        className={getTATStatusClass(
                          caseData.tatStatus
                        )}
                      >
                        <span className="tat-status-dot"></span>

                        {getTATStatusLabel(caseData.tatStatus)}
                      </span>
                    </td>

                    <td>
                      <Link
                        className="tat-view-button"
                        to={`/tat/${caseData.caseId}`}
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TATDashboard;