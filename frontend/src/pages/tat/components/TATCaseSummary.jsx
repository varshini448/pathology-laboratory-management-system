import {
  formatDateTime,
  formatDuration,
  getPriorityClass,
  getTATStatusClass,
  getTATStatusLabel,
} from "../tatDetailsUtils";

const TATCaseSummary = ({ caseTAT }) => {
  return (
    <div className="tat-card">
      <div className="tat-card-header">
        <div>
          <h2>Case Summary</h2>
          <p>Current status and turnaround information.</p>
        </div>
      </div>

      <div className="tat-details-grid">
        <div className="tat-detail-item">
          <span>Case ID</span>
          <strong>{caseTAT.caseId}</strong>
        </div>

        <div className="tat-detail-item">
          <span>Patient</span>
          <strong>{caseTAT.patient?.name || "N/A"}</strong>
        </div>

        <div className="tat-detail-item">
          <span>Doctor</span>
          <strong>{caseTAT.doctor?.name || "N/A"}</strong>
        </div>

        <div className="tat-detail-item">
          <span>Priority</span>
          <strong>
            <span className={getPriorityClass(caseTAT.priority)}>
              {caseTAT.priority || "N/A"}
            </span>
          </strong>
        </div>

        <div className="tat-detail-item">
          <span>Case Status</span>
          <strong>{caseTAT.caseStatus || "N/A"}</strong>
        </div>

        <div className="tat-detail-item tat-detail-highlight">
          <span>Current TAT</span>
          <strong>{formatDuration(caseTAT.tatMinutes)}</strong>
        </div>

        <div className="tat-detail-item">
          <span>Target TAT</span>
          <strong>{formatDuration(caseTAT.targetMinutes)}</strong>
        </div>

        <div className="tat-detail-item">
          <span>Started</span>
          <strong>{formatDateTime(caseTAT.startTime)}</strong>
        </div>

        <div className="tat-detail-item">
          <span>TAT Status</span>
          <strong>
            <span className={getTATStatusClass(caseTAT.tatStatus)}>
              <span className="tat-status-dot"></span>
              {getTATStatusLabel(caseTAT.tatStatus)}
            </span>
          </strong>
        </div>
      </div>
    </div>
  );
};

export default TATCaseSummary;
