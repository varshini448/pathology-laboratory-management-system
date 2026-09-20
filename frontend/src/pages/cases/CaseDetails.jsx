import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getCaseById } from "../../services/caseService";
import { getWorkflowEventsByCase } from "../../services/workflowService";
import { getSpecimensByCase } from "../../services/specimenService";
import { getBlocksByCase } from "../../services/blockService";
import { getSlidesByCase } from "../../services/slideService";

import WorkflowAction from "../../components/workflow/WorkflowAction";
import WorkflowTimeline from "../../components/workflow/WorkflowTimeline";
import WorkflowStatus from "../../components/workflow/WorkflowStatus";
import WorkflowStepper from "../../components/workflow/WorkflowStepper";

const CaseDetails = () => {
  const { id } = useParams();

  const [caseData, setCaseData] = useState(null);
  const [workflowEvents, setWorkflowEvents] = useState([]);

  const [specimens, setSpecimens] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [slides, setSlides] = useState([]);

  const [loading, setLoading] = useState(true);
  const [workflowLoading, setWorkflowLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWorkflow = async () => {
    try {
      setWorkflowLoading(true);

      const events = await getWorkflowEventsByCase(id);
      setWorkflowEvents(events);
    } catch (err) {
      setError(err.message);
    } finally {
      setWorkflowLoading(false);
    }
  };

  useEffect(() => {
    const loadCase = async () => {
      try {
        const data = await getCaseById(id);
        setCaseData(data);

        const [specimenData, blockData, slideData] =
          await Promise.all([
            getSpecimensByCase(id),
            getBlocksByCase(id),
            getSlidesByCase(id),
          ]);

        setSpecimens(specimenData);
        setBlocks(blockData);
        setSlides(slideData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCase();
    loadWorkflow();
  }, [id]);

  if (loading) {
    return <p>Loading case...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!caseData) {
    return <p>Case not found.</p>;
  }

  return (
    <div>
      <h1>Case Details</h1>

      <p>
        <strong>Case ID:</strong> {caseData.caseId}
      </p>

      <p>
        <strong>Case Type:</strong> {caseData.caseType}
      </p>

      <p>
        <strong>Priority:</strong> {caseData.priority}
      </p>

      <p>
        <strong>Status:</strong> {caseData.status}
      </p>

      <p>
        <strong>Patient:</strong>{" "}
        {caseData.patient?.name || caseData.patient}
      </p>

      <p>
        <strong>Doctor:</strong>{" "}
        {caseData.doctor?.name || caseData.doctor}
      </p>

      <p>
        <strong>Clinical History:</strong>{" "}
        {caseData.clinicalHistory || "-"}
      </p>

      <hr />

      <WorkflowStatus workflowEvents={workflowEvents} />

      <hr />

      <WorkflowStepper workflowEvents={workflowEvents} />

      <hr />

      {workflowLoading ? (
        <p>Loading workflow...</p>
      ) : (
        <WorkflowTimeline workflowEvents={workflowEvents} />
      )}

      <hr />

      <WorkflowAction
        caseId={caseData._id}
        specimenId={specimens[0]?._id}
        blockId={blocks[0]?._id}
        slideId={slides[0]?._id}
        onWorkflowCreated={loadWorkflow}
      />
    </div>
  );
};

export default CaseDetails;

