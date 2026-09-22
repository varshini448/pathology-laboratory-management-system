import { api } from "./api";

export const getCaseTAT = async (caseId) => {
  const response = await api.get(`/tat/case/${caseId}`);

  return response.data;
};

export const getAllCaseTAT = async () => {
  const response = await api.get("/tat");

  return response.data;
};

export const getStageTAT = async (caseId) => {
  const response = await api.get(`/tat/case/${caseId}/stages`);

  return response.data;
};