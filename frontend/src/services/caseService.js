import { api } from "./api";

export const getCases = async () => {
  const response = await api.get("/cases");
  return response.cases;
};

export const getCaseById = async (caseId) => {
  const response = await api.get(`/cases/${caseId}`);
  return response.case;
};

export const createCase = async (caseData) => {
  const response = await api.post("/cases", caseData);
  return response.case;
};

export const updateCase = async (caseId, caseData) => {
  const response = await api.put(`/cases/${caseId}`, caseData);
  return response.case;
};