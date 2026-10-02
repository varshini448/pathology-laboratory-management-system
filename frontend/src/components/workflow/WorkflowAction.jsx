import { useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  FileText,
  Loader2,
  Save,
} from "lucide-react";
import { createWorkflowEvent } from "../../services/workflowService";

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

const WorkflowAction = ({
  caseId,
  specimenId,
  blockId,
  slideId,
  onWorkflowCreated,
}) => {
  const [stage, setStage] = useState("");
  const [status, setStatus] = useState("STARTED");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stage) {
      setMessage("Please select a workflow stage");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const workflowData = {
        case: caseId,
        stage,
        status,
        notes,
      };

      if (specimenId) {
        workflowData.specimen = specimenId;
      }

      if (blockId) {
        workflowData.block = blockId;
      }

      if (slideId) {
        workflowData.slide = slideId;
      }

      await createWorkflowEvent(workflowData);

      setMessage("Workflow event created successfully");
      setStage("");
      setStatus("STARTED");
      setNotes("");

      if (onWorkflowCreated) {
        onWorkflowCreated();
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="workflow-action-card">
      <div className="workflow-action-header">
        <div className="workflow-action-icon">
          <ClipboardList size={20} />
        </div>

        <div>
          <span className="workflow-action-eyebrow">
            WORKFLOW CONTROL
          </span>
          <h3>Update Workflow</h3>
          <p>
            Record the next laboratory processing event for this case.
          </p>
        </div>
      </div>

      <form className="workflow-action-form" onSubmit={handleSubmit}>
        <div className="workflow-action-fields">
          <div className="workflow-action-field">
            <label htmlFor="workflow-stage">Stage</label>

            <div className="workflow-action-input">
              <ClipboardList size={17} />

              <select
                id="workflow-stage"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              >
                <option value="">Select workflow stage</option>

                {workflowStages.map((workflowStage) => (
                  <option key={workflowStage} value={workflowStage}>
                    {workflowStage.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="workflow-action-field">
            <label htmlFor="workflow-status">Status</label>

            <div className="workflow-action-input">
              <CheckCircle2 size={17} />

              <select
                id="workflow-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="STARTED">Started</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="workflow-action-field">
          <label htmlFor="workflow-notes">Notes</label>

          <div className="workflow-action-textarea">
            <FileText size={17} />

            <textarea
              id="workflow-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter workflow notes..."
              rows={4}
            />
          </div>
        </div>

        <div className="workflow-action-footer">
          <div className="workflow-action-message">
            {message && (
              <span
                className={
                  message.includes("successfully")
                    ? "workflow-success"
                    : "workflow-error"
                }
              >
                {message.includes("successfully") && (
                  <CheckCircle2 size={16} />
                )}
                {message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="workflow-action-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={17} className="workflow-spinner" />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Workflow Event
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default WorkflowAction;