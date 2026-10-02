import { useCallback, useEffect, useState } from "react";

import { getCaseById } from "../services/caseService";
import { getWorkflowEventsByCase } from "../services/workflowService";
import { getSpecimensByCase } from "../services/specimenService";
import { getBlocksByCase } from "../services/blockService";
import { getSlidesByCase } from "../services/slideService";

const useCaseDetails = (caseId) => {
  const [caseData, setCaseData] = useState(null);
  const [workflowEvents, setWorkflowEvents] = useState([]);
  const [specimens, setSpecimens] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workflowLoading, setWorkflowLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWorkflow = useCallback(async () => {
    try {
      setWorkflowLoading(true);
      const events = await getWorkflowEventsByCase(caseId);
      setWorkflowEvents(events);
    } catch (err) {
      setError(err.message);
    } finally {
      setWorkflowLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    const loadCase = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCaseById(caseId);

        const [specimenData, blockData, slideData] =
          await Promise.all([
            getSpecimensByCase(caseId),
            getBlocksByCase(caseId),
            getSlidesByCase(caseId),
          ]);

        setCaseData(data);
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
  }, [caseId, loadWorkflow]);

  return {
    caseData,
    workflowEvents,
    specimens,
    blocks,
    slides,
    loading,
    workflowLoading,
    error,
    loadWorkflow,
  };
};

export default useCaseDetails;
