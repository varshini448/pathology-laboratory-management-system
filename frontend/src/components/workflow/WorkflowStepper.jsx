const workflowStages = [
  "SPECIMEN_COLLECTION",
  "ACCESSIONING",
  "GROSSING",
  "EMBEDDING",
  "SECTIONING",
  "STAINING",
  "SCANNING",
  "PATHOLOGIST_REVIEW",
];

const WorkflowStepper = ({ workflowEvents = [] }) => {
  const latestEventsByStage = {};

  workflowEvents.forEach((event) => {
    const existingEvent = latestEventsByStage[event.stage];

    if (
      !existingEvent ||
      new Date(event.createdAt) > new Date(existingEvent.createdAt)
    ) {
      latestEventsByStage[event.stage] = event;
    }
  });

  const currentStage =
    workflowEvents.length > 0
      ? workflowEvents[workflowEvents.length - 1].stage
      : null;

  const formatStage = (stage) => {
    return stage.replaceAll("_", " ");
  };

  return (
    <div>
      <h3>Workflow Progress</h3>

      {workflowStages.map((stage, index) => {
        const latestEvent = latestEventsByStage[stage];

        const isCompleted =
          latestEvent && latestEvent.status === "COMPLETED";

        const isCurrent =
          latestEvent &&
          latestEvent.status === "STARTED" &&
          currentStage === stage;

        return (
          <div key={stage}>
            <strong>
              {index + 1}. {formatStage(stage)}
            </strong>

            <span>
              {isCompleted
                ? " ✓ Completed"
                : isCurrent
                ? " → Current"
                : " ○ Pending"}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default WorkflowStepper;