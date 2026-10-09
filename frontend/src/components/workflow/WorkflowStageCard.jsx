import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  UserRound,
} from "lucide-react";

const formatStage = (stage) =>
  stage
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const WorkflowStageCard = ({
  stageGroup,
  index,
  totalStages,
  isExpanded,
  toggleStage,
}) => {
  const {
    stage,
    events,
    latestEvent,
    startedEvent,
    completedEvent,
    isCompleted,
    duration,
  } = stageGroup;

  return (
    <article
      className={`workflow-stage-card ${
        isCompleted
          ? "workflow-stage-card--completed"
          : "workflow-stage-card--active"
      }`}
      key={stage}
    >
      <div className="workflow-stage-indicator">
        <div className="workflow-stage-marker">
          {isCompleted ? (
            <CheckCircle2 size={17} />
          ) : (
            <Clock3 size={16} />
          )}
        </div>

        {index < totalStages - 1 && (
          <div className="workflow-stage-line" />
        )}
      </div>

      <div className="workflow-stage-content">
        <div className="workflow-stage-header">
          <div>
            <span className="workflow-stage-number">
              STAGE {String(index + 1).padStart(2, "0")}
            </span>

            <h4>{formatStage(stage)}</h4>
          </div>

          <span
            className={`workflow-stage-status ${
              isCompleted
                ? "workflow-stage-status--completed"
                : "workflow-stage-status--active"
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 size={14} />
            ) : (
              <Clock3 size={14} />
            )}

            {isCompleted ? "Completed" : "In Progress"}
          </span>
        </div>

        <div className="workflow-stage-summary">
          <div className="workflow-stage-meta">
            <Clock3 size={14} />

            <div>
              <span>Last activity</span>
              <strong>{formatDate(latestEvent.createdAt)}</strong>
            </div>
          </div>

          {latestEvent.performedBy && (
            <div className="workflow-stage-meta">
              <UserRound size={14} />

              <div>
                <span>Performed by</span>

                <strong>{latestEvent.performedBy.name}</strong>

                {latestEvent.performedBy.role && (
                  <small>{latestEvent.performedBy.role}</small>
                )}
              </div>
            </div>
          )}

          {duration && (
            <div className="workflow-stage-meta">
              <Clock3 size={14} />

              <div>
                <span>Stage duration</span>
                <strong>{duration}</strong>
              </div>
            </div>
          )}
        </div>

        {latestEvent.notes && (
          <div className="workflow-stage-notes">
            <FileText size={14} />

            <div>
              <span>Processing note</span>
              <p>{latestEvent.notes}</p>
            </div>
          </div>
        )}

        {events.length > 1 && (
          <button
            type="button"
            className="workflow-stage-history-toggle"
            onClick={() => toggleStage(stage)}
          >
            <span>
              {isExpanded
                ? "Hide event history"
                : `View ${events.length} recorded events`}
            </span>

            <ChevronDown
              size={15}
              className={isExpanded ? "workflow-chevron--expanded" : ""}
            />
          </button>
        )}

        {isExpanded && (
          <div className="workflow-stage-history">
            {events.map((event, eventIndex) => (
              <div
                className="workflow-history-event"
                key={event._id}
              >
                <div>
                  <span>
                    EVENT {String(eventIndex + 1).padStart(2, "0")}
                  </span>

                  <strong>{event.status}</strong>
                </div>

                <time>{formatDate(event.createdAt)}</time>

                {event.notes && <p>{event.notes}</p>}
              </div>
            ))}
          </div>
        )}

        {startedEvent &&
          completedEvent &&
          startedEvent._id !== completedEvent._id && (
            <div className="workflow-stage-flow">
              <span>Started</span>
              <span className="workflow-stage-flow-line" />
              <span>Completed</span>
            </div>
          )}
      </div>
    </article>
  );
};

export default WorkflowStageCard;
