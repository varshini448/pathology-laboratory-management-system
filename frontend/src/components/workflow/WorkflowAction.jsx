import { useState } from "react";
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
    <div>
      <h3>Workflow Action</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Stage</label>

          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
          >
            <option value="">Select stage</option>

            {workflowStages.map((workflowStage) => (
              <option key={workflowStage} value={workflowStage}>
                {workflowStage.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Status</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="STARTED">Started</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div>
          <label>Notes</label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter workflow notes"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Workflow Event"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default WorkflowAction;