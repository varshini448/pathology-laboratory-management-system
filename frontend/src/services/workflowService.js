import { api } from "./api";

export const createWorkflowEvent = async (workflowData) => {
  const response = await api.post("/workflow", workflowData);
  return response;
};

export const getWorkflowEventsByCase = async (caseId) => {
  const response = await api.get(`/workflow/case/${caseId}`);
  return response;
};