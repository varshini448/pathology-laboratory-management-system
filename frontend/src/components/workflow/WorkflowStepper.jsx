import { Check, Circle, Clock3 } from "lucide-react";

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

  const formatStage = (stage) =>
    stage
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <section className="workflow-stepper">
      <div className="workflow-stepper-header">
        <div>
          <span className="workflow-section-eyebrow">
            PROCESS TRACKING
          </span>

          <h3>Workflow Progress</h3>

          <p>
            Track the case through each stage of the laboratory process.
          </p>
        </div>

        <span className="workflow-stepper-count">
          {workflowStages.length} stages
        </span>
      </div>

      <div className="workflow-stepper-track">
        {workflowStages.map((stage, index) => {
          const latestEvent = latestEventsByStage[stage];

          const isCompleted =
            latestEvent && latestEvent.status === "COMPLETED";

          const isCurrent =
            latestEvent &&
            latestEvent.status === "STARTED" &&
            currentStage === stage;

          const isPending = !latestEvent;

          return (
            <div
              key={stage}
              className={`workflow-step ${
                isCompleted
                  ? "workflow-step--completed"
                  : isCurrent
                  ? "workflow-step--current"
                  : "workflow-step--pending"
              }`}
            >
              <div className="workflow-step-node-wrapper">
                <div className="workflow-step-node">
                  {isCompleted ? (
                    <Check size={15} strokeWidth={2.5} />
                  ) : isCurrent ? (
                    <Clock3 size={14} strokeWidth={2.2} />
                  ) : (
                    <Circle size={9} strokeWidth={2} />
                  )}
                </div>

                {index < workflowStages.length - 1 && (
                  <div className="workflow-step-connector" />
                )}
              </div>

              <div className="workflow-step-content">
                <span className="workflow-step-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <strong>{formatStage(stage)}</strong>

                <span className="workflow-step-status">
                  {isCompleted
                    ? "Completed"
                    : isCurrent
                    ? "In progress"
                    : isPending
                    ? "Pending"
                    : "Pending"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WorkflowStepper;