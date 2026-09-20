const WorkflowStatus = ({ workflowEvents = [] }) => {
  if (workflowEvents.length === 0) {
    return (
      <div>
        <h3>Current Workflow Status</h3>
        <p>Workflow has not started yet.</p>
      </div>
    );
  }

  const latestEvent = workflowEvents[workflowEvents.length - 1];

  const formatStage = (stage) => {
    return stage.replaceAll("_", " ");
  };

  return (
    <div>
      <h3>Current Workflow Status</h3>

      <p>
        <strong>Stage:</strong> {formatStage(latestEvent.stage)}
      </p>

      <p>
        <strong>Status:</strong> {latestEvent.status}
      </p>

      {latestEvent.performedBy && (
        <p>
          <strong>Performed by:</strong>{" "}
          {latestEvent.performedBy.name}
        </p>
      )}

      <p>
        <strong>Last updated:</strong>{" "}
        {new Date(latestEvent.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default WorkflowStatus;