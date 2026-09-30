import React from "react";

const StationEventLog = ({ events = [] }) => {
  if (events.length === 0) {
    return (
      <div className="workflow-station-event-log empty">
        No station events recorded.
      </div>
    );
  }

  return (
    <section className="workflow-station-event-log">
      <div className="workflow-event-log-header">
        <div>
          <h3>Station Event Log</h3>
          <p>Recent workflow activity at this station.</p>
        </div>

        <span>{events.length} event(s)</span>
      </div>

      <div className="workflow-event-list">
        {events.map((event, index) => (
          <div
            className="workflow-event-item"
            key={event._id || event.id || index}
          >
            <div className="workflow-event-marker" />

            <div className="workflow-event-content">
              <div className="workflow-event-top">
                <strong>
                  {event.stage || event.eventType || "Workflow Event"}
                </strong>

                <span>
                  {event.status || "RECORDED"}
                </span>
              </div>

              <p>
                {event.message ||
                  event.description ||
                  "Workflow event recorded."}
              </p>

              <small>
                {event.user?.name ||
                  event.user?.username ||
                  event.performedBy ||
                  "System"}
                {" • "}
                {event.createdAt
                  ? new Date(event.createdAt).toLocaleString("en-IN")
                  : "Time unavailable"}
              </small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StationEventLog;