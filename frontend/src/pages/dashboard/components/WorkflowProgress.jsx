import React from "react";

const WorkflowProgress = ({
  stages = [],
  currentStage,
  completedStages = [],
}) => {
  const completedSet = new Set(completedStages);

  return (
    <div className="workflow-progress">
      {stages.map((stage, index) => {
        const stageKey =
          typeof stage === "string" ? stage : stage.key || stage.id;
        const stageLabel =
          typeof stage === "string" ? stage : stage.label || stage.name;

        const isCompleted = completedSet.has(stageKey);
        const isCurrent = currentStage === stageKey;

        return (
          <div
            className={`workflow-progress-step${
              isCompleted ? " completed" : ""
            }${isCurrent ? " current" : ""}`}
            key={stageKey || index}
          >
            <div className="workflow-progress-marker">
              {isCompleted ? "✓" : index + 1}
            </div>

            <div className="workflow-progress-label">
              <span>{stageLabel}</span>
            </div>

            {index < stages.length - 1 && (
              <div
                className={`workflow-progress-line${
                  isCompleted ? " completed" : ""
                }`}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WorkflowProgress;
