import React from "react";

const WorkflowHistory = ({ events = [] }) => {
  if (events.length === 0) {
    return (
      <div className="workflow-history-empty">
        No workflow history available.
      </div>
    );
  }

  return (
    <section className="workflow-history">
      <div className="workflow-history-header">
        <h3>Workflow History</h3>
        <span>{events.length} event(s)</span>
      </div>

      <div className="workflow-history-list">
        {events.map((event, index) => (
          <div
            className="workflow-history-item"
            key={event._id || event.id || index}
          >
            <div className="workflow-history-step">
              <span>{index + 1}</span>
            </div>

            <div className="workflow-history-content">
              <div className="workflow-history-title">
                <strong>
                  {event.stage || "Workflow Stage"}
                </strong>

                <span>
                  {event.status || "RECORDED"}
                </span>
              </div>

              <p>
                {event.description ||
                  event.message ||
                  "Workflow event recorded."}
              </p>

              <small>
                {event.createdAt
                  ? new Date(event.createdAt).toLocaleString("en-IN")
                  : "Date unavailable"}
              </small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorkflowHistory;