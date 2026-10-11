import { Clock3 } from "lucide-react";
import { useState } from "react";
import WorkflowStageCard from "./WorkflowStageCard";

const WORKFLOW_STAGES = [
  "SPECIMEN_COLLECTION",
  "ACCESSIONING",
  "GROSSING",
  "EMBEDDING",
  "SECTIONING",
  "STAINING",
  "SCANNING",
  "PATHOLOGIST_REVIEW",
];

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

const getEventTime = (event) => {
  const timestamp = new Date(event?.createdAt).getTime();
  return Number.isFinite(timestamp) ? timestamp : Number.NEGATIVE_INFINITY;
};

const buildStageGroups = (workflowEvents) =>
  WORKFLOW_STAGES.map((stage) => {
    const sortedEvents = workflowEvents
      .filter((event) => event.stage === stage)
      .sort((a, b) => {
        const aTime = getEventTime(a);
        const bTime = getEventTime(b);

        if (aTime === bTime) return 0;
        return aTime < bTime ? -1 : 1;
      });

    const latestEvent = sortedEvents[sortedEvents.length - 1] ?? null;
    let startedEvent = null;
    let completedEvent = null;

    if (latestEvent?.status === "COMPLETED") {
      completedEvent = latestEvent;

      // Match this completion to the latest STARTED event
      // since the previous completion, not an older run.
      for (let i = sortedEvents.length - 2; i >= 0; i -= 1) {
        const event = sortedEvents[i];

        if (event.status === "COMPLETED") break;

        if (event.status === "STARTED") {
          startedEvent = event;
          break;
        }
      }
    } else if (latestEvent?.status === "STARTED") {
      startedEvent = latestEvent;
    }

    const isCompleted = latestEvent?.status === "COMPLETED";
    const duration =
      startedEvent && completedEvent
        ? formatDuration(startedEvent.createdAt, completedEvent.createdAt)
        : null;

    return {
      stage,
      events: sortedEvents,
      latestEvent,
      startedEvent,
      completedEvent,
      isCompleted,
      duration,
    };
  }).filter((stageGroup) => stageGroup.latestEvent);

const WorkflowTimeline = ({ workflowEvents = [] }) => {
  const [expandedStages, setExpandedStages] = useState({});

  const stageGroups = buildStageGroups(workflowEvents);

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
          {stageGroups.map((stageGroup, index) => (
            <WorkflowStageCard
              key={stageGroup.stage}
              stageGroup={stageGroup}
              index={index}
              totalStages={stageGroups.length}
              isExpanded={Boolean(expandedStages[stageGroup.stage])}
              toggleStage={toggleStage}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default WorkflowTimeline;
