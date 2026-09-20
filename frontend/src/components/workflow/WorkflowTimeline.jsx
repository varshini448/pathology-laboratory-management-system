const WorkflowTimeline = ({ workflowEvents = [] }) => {
  const formatStage = (stage) => {
    return stage.replaceAll("_", " ");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div>
      <h3>Histopathology Workflow</h3>

      {workflowEvents.length === 0 ? (
        <p>No workflow events recorded yet.</p>
      ) : (
        <div>
          {workflowEvents.map((event) => (
            <div key={event._id}>
              <h4>{formatStage(event.stage)}</h4>

              <p>
                <strong>Status:</strong> {event.status}
              </p>

              <p>
                <strong>Date:</strong> {formatDate(event.createdAt)}
              </p>

              {event.performedBy && (
                <p>
                  <strong>Performed by:</strong>{" "}
                  {event.performedBy.name} ({event.performedBy.role})
                </p>
              )}

              {event.notes && (
                <p>
                  <strong>Notes:</strong> {event.notes}
                </p>
              )}

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkflowTimeline;