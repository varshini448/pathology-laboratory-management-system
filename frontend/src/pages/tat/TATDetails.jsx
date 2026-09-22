import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getCaseTAT,
  getStageTAT,
} from "../../services/tatService";

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

const formatDateTime = (date) => {
  if (!date) {
    return "N/A";
  }

  return new Date(date).toLocaleString();
};

const formatStageName = (stage) => {
  return stage
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
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

const TATDetails = () => {
  const { caseId } = useParams();

  const [caseTAT, setCaseTAT] = useState(null);
  const [stageTAT, setStageTAT] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTATDetails = async () => {
      try {
        setLoading(true);

        const [caseData, stageData] = await Promise.all([
          getCaseTAT(caseId),
          getStageTAT(caseId),
        ]);

        setCaseTAT(caseData);
        setStageTAT(stageData);

        setError("");
      } catch (err) {
        console.error("Failed to load TAT details:", err);
        setError(err.message || "Failed to load TAT details");
      } finally {
        setLoading(false);
      }
    };

    loadTATDetails();
  }, [caseId]);

  if (loading) {
    return (
      <div className="tat-page">
        <div className="tat-loading">
          <div className="tat-spinner"></div>

          <p>Loading TAT details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tat-page">
        <div className="tat-error">
          <h2>Unable to load TAT details</h2>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!caseTAT) {
    return (
      <div className="tat-page">
        <div className="tat-empty">
          <h2>No TAT information found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="tat-page">
      {/* Header */}
      <div className="tat-page-header tat-details-header">
        <div>
          <Link to="/tat" className="tat-back-link">
            ← Back to TAT Dashboard
          </Link>

          <p className="tat-eyebrow">
            CASE TURNAROUND MONITORING
          </p>

          <h1>
            TAT Details

            <span className="tat-header-case-id">
              {caseTAT.caseId}
            </span>
          </h1>

          <p className="tat-page-description">
            Case turnaround time and stage-wise processing duration.
          </p>
        </div>
      </div>

      {/* Case Summary */}
      <div className="tat-card">
        <div className="tat-card-header">
          <div>
            <h2>Case Summary</h2>

            <p>
              Current status and turnaround information.
            </p>
          </div>
        </div>

        <div className="tat-details-grid">
          <div className="tat-detail-item">
            <span>Case ID</span>

            <strong>{caseTAT.caseId}</strong>
          </div>

          <div className="tat-detail-item">
            <span>Patient</span>

            <strong>
              {caseTAT.patient?.name || "N/A"}
            </strong>
          </div>

          <div className="tat-detail-item">
            <span>Doctor</span>

            <strong>
              {caseTAT.doctor?.name || "N/A"}
            </strong>
          </div>

          <div className="tat-detail-item">
            <span>Priority</span>

            <strong>
              <span
                className={getPriorityClass(
                  caseTAT.priority
                )}
              >
                {caseTAT.priority || "N/A"}
              </span>
            </strong>
          </div>

          <div className="tat-detail-item">
            <span>Case Status</span>

            <strong>
              {caseTAT.caseStatus || "N/A"}
            </strong>
          </div>

          <div className="tat-detail-item tat-detail-highlight">
            <span>Current TAT</span>

            <strong>
              {formatDuration(caseTAT.tatMinutes)}
            </strong>
          </div>

          <div className="tat-detail-item">
            <span>Target TAT</span>

            <strong>
              {formatDuration(caseTAT.targetMinutes)}
            </strong>
          </div>

          <div className="tat-detail-item">
            <span>Started</span>

            <strong>
              {formatDateTime(caseTAT.startTime)}
            </strong>
          </div>

          <div className="tat-detail-item">
            <span>TAT Status</span>

            <strong>
              <span
                className={getTATStatusClass(
                  caseTAT.tatStatus
                )}
              >
                <span className="tat-status-dot"></span>

                {getTATStatusLabel(
                  caseTAT.tatStatus
                )}
              </span>
            </strong>
          </div>
        </div>
      </div>

      {/* Stage TAT */}
      <div className="tat-card">
        <div className="tat-card-header">
          <div>
            <h2>Stage-wise Turnaround Time</h2>

            <p>
              Processing duration recorded for each workflow stage.
            </p>
          </div>
        </div>

        {stageTAT.length === 0 ? (
          <div className="tat-empty">
            <h3>No workflow stage data</h3>

            <p>
              Workflow events will appear here as the case progresses.
            </p>
          </div>
        ) : (
          <div className="tat-table-wrapper">
            <table className="tat-table tat-stage-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Workflow Stage</th>
                  <th>Started</th>
                  <th>Completed</th>
                  <th>Duration</th>
                </tr>
              </thead>

              <tbody>
                {stageTAT.map((stage, index) => (
                  <tr key={stage.stage}>
                    <td className="tat-stage-number">
                      {String(index + 1).padStart(2, "0")}
                    </td>

                    <td>
                      <strong>
                        {formatStageName(stage.stage)}
                      </strong>
                    </td>

                    <td>
                      {formatDateTime(stage.startedAt)}
                    </td>

                    <td>
                      {formatDateTime(stage.completedAt)}
                    </td>

                    <td>
                      <strong>
                        {formatDuration(
                          stage.durationMinutes
                        )}
                      </strong>
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

export default TATDetails;