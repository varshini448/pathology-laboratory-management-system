import WorkflowAction from "../workflow/WorkflowAction";
import WorkflowStatus from "../workflow/WorkflowStatus";
import WorkflowStepper from "../workflow/WorkflowStepper";
import WorkflowTimeline from "../workflow/WorkflowTimeline";

const CaseWorkflow = ({
  caseId,
  specimenId,
  blockId,
  slideId,
  workflowEvents = [],
  onWorkflowUpdated,
}) => {
  return (
    <section className="case-workflow-section">
      <div className="case-workflow-header">
        <span className="case-section-eyebrow">LABORATORY WORKFLOW</span>

        <h2>Workflow Progress</h2>

        <p>
          Track the case through each stage of the histopathology process.
        </p>
      </div>

      <div className="case-workflow-status">
        <WorkflowStatus workflowEvents={workflowEvents} />
      </div>

      <div className="case-workflow-stepper">
        <WorkflowStepper workflowEvents={workflowEvents} />
      </div>

      <div className="case-workflow-timeline">
        <WorkflowTimeline workflowEvents={workflowEvents} />
      </div>

      <div className="case-workflow-action">
        <WorkflowAction
          caseId={caseId}
          specimenId={specimenId}
          blockId={blockId}
          slideId={slideId}
          onWorkflowCreated={onWorkflowUpdated}
        />
      </div>
    </section>
  );
};

export default CaseWorkflow;