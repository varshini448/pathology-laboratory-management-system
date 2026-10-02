import {
  Activity,
  CheckCircle2,
  Clock3,
  UserRound,
} from "lucide-react";

const WorkflowStatus = ({ workflowEvents = [] }) => {
  if (!workflowEvents.length) {
    return (
      <section className="workflow-status-card">
        <div className="workflow-status-header">
          <div className="workflow-status-title">
            <span className="workflow-status-icon">
              <Activity size={17} />
            </span>

            <div>
              <span className="workflow-section-eyebrow">
                LABORATORY PROCESS
              </span>

              <h3>Current Workflow Status</h3>
            </div>
          </div>
        </div>

        <div className="workflow-status-empty">
          <Clock3 size={18} />
          <span>No workflow activity has been recorded yet.</span>
        </div>
      </section>
    );
  }

  const latestEvent = workflowEvents[workflowEvents.length - 1];

  const formatStage = (stage) =>
    stage
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

  const isCompleted = latestEvent.status === "COMPLETED";

  const formattedDate = latestEvent.createdAt
    ? new Date(latestEvent.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not available";

  const performedBy =
    latestEvent.performedBy?.name ||
    latestEvent.performedBy?.fullName ||
    latestEvent.performedBy?.email ||
    "System Administrator";

  const performedByRole =
    latestEvent.performedBy?.role || "ADMIN";

  return (
    <section className="workflow-status-card">
      {/* Header */}
      <div className="workflow-status-header">
        <div className="workflow-status-title">
          <span className="workflow-status-icon">
            <Activity size={17} />
          </span>

          <div>
            <span className="workflow-section-eyebrow">
              LABORATORY PROCESS
            </span>

            <h3>Current Workflow Status</h3>

            <p>
              Latest recorded processing activity for this case.
            </p>
          </div>
        </div>

        <span
          className={`workflow-current-badge ${
            isCompleted
              ? "workflow-current-completed"
              : "workflow-current-started"
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 size={15} />
          ) : (
            <Clock3 size={15} />
          )}

          {isCompleted ? "Completed" : "In Progress"}
        </span>
      </div>

      {/* Main status */}
      <div className="workflow-status-main">
        <div className="workflow-status-stage">
          <span className="workflow-status-label">
            CURRENT STAGE
          </span>

          <h4>{formatStage(latestEvent.stage)}</h4>
        </div>

        <div className="workflow-status-meta">
          <div className="workflow-status-meta-item">
            <span className="workflow-status-meta-icon">
              <UserRound size={15} />
            </span>

            <div>
              <span className="workflow-status-meta-label">
                Performed by
              </span>

              <div className="workflow-status-user">
                <strong>{performedBy}</strong>
                <span>{performedByRole}</span>
              </div>
            </div>
          </div>

          <div className="workflow-status-meta-item">
            <span className="workflow-status-meta-icon">
              <Clock3 size={15} />
            </span>

            <div>
              <span className="workflow-status-meta-label">
                Last updated
              </span>

              <strong className="workflow-status-date">
                {formattedDate}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowStatus;