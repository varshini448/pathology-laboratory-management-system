import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  UserRound,
} from "lucide-react";
import { useState } from "react";

const WorkflowTimeline = ({ workflowEvents = [] }) => {
  const [expandedStages, setExpandedStages] = useState({});

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

  const formatDuration = (start, end) => {
    if (!start || !end) return null;

    const difference =
      new Date(end).getTime() - new Date(start).getTime();

    if (difference < 0) return null;

    const totalSeconds = Math.floor(difference / 1000);

    if (totalSeconds < 60) {
      return `${totalSeconds} sec`;
    }

    const minutes = Math.floor(totalSeconds / 60);

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return remainingMinutes
      ? `${hours} hr ${remainingMinutes} min`
      : `${hours} hr`;
  };

  const stageGroups = workflowStages
    .map((stage) => {
      const events = workflowEvents.filter(
        (event) => event.stage === stage
      );

      if (!events.length) return null;

      const sortedEvents = [...events].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      );

      const latestEvent = sortedEvents[sortedEvents.length - 1];

      const startedEvent = sortedEvents.find(
        (event) => event.status === "STARTED"
      );

      const completedEvent = [...sortedEvents]
        .reverse()
        .find((event) => event.status === "COMPLETED");

      const isCompleted = latestEvent.status === "COMPLETED";

      return {
        stage,
        events: sortedEvents,
        latestEvent,
        startedEvent,
        completedEvent,
        isCompleted,
        duration: formatDuration(
          startedEvent?.createdAt,
          completedEvent?.createdAt
        ),
      };
    })
    .filter(Boolean);

  const toggleStage = (stage) => {
    setExpandedStages((previous) => ({
      ...previous,
      [stage]: !previous[stage],
    }));
  };

  return (
    <section className="workflow-timeline-section">
      <div className="workflow-timeline-header">
        <div>
          <span className="workflow-section-eyebrow">
            PROCESS HISTORY
          </span>

          <h3>Histopathology Workflow</h3>

          <p>
            Complete processing history for this laboratory case.
          </p>
        </div>

        {workflowEvents.length > 0 && (
          <div className="workflow-event-count">
            {workflowEvents.length}{" "}
            {workflowEvents.length === 1 ? "Event" : "Events"}
          </div>
        )}
      </div>

      {workflowEvents.length === 0 ? (
        <div className="workflow-empty-state">
          <div className="workflow-empty-icon">
            <Clock3 size={22} />
          </div>

          <h4>No workflow events recorded</h4>

          <p>
            Workflow activity for this case will appear here once
            processing begins.
          </p>
        </div>
      ) : (
        <div className="workflow-stage-list">
          {stageGroups.map((stageGroup, index) => {
            const {
              stage,
              events,
              latestEvent,
              startedEvent,
              completedEvent,
              isCompleted,
              duration,
            } = stageGroup;

            const isExpanded = expandedStages[stage];

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

                  {index < stageGroups.length - 1 && (
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
                        <strong>
                          {formatDate(latestEvent.createdAt)}
                        </strong>
                      </div>
                    </div>

                    {latestEvent.performedBy && (
                      <div className="workflow-stage-meta">
                        <UserRound size={14} />

                        <div>
                          <span>Performed by</span>

                          <strong>
                            {latestEvent.performedBy.name}
                          </strong>

                          {latestEvent.performedBy.role && (
                            <small>
                              {latestEvent.performedBy.role}
                            </small>
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
                        className={
                          isExpanded
                            ? "workflow-chevron--expanded"
                            : ""
                        }
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
                              EVENT{" "}
                              {String(eventIndex + 1).padStart(
                                2,
                                "0"
                              )}
                            </span>

                            <strong>{event.status}</strong>
                          </div>

                          <time>
                            {formatDate(event.createdAt)}
                          </time>

                          {event.notes && (
                            <p>{event.notes}</p>
                          )}
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
          })}
        </div>
      )}
    </section>
  );
};

export default WorkflowTimeline;