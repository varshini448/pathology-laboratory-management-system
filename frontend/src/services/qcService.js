import { api } from "./api";

export const getQCRecords = async () => {
  const response = await api.get("/qc");
  return response.qcRecords;
};

export const getQCRecordsByCase = async (caseId) => {
  const response = await api.get(`/qc/case/${caseId}`);
  return response.qcRecords;
};

export const getQCRecordById = async (qcId) => {
  const response = await api.get(`/qc/${qcId}`);
  return response.qcRecord;
};

export const createQCRecord = async (qcData) => {
  const response = await api.post("/qc", qcData);
  return response.qcRecord;
};

export const updateQCRecord = async (qcId, qcData) => {
  const response = await api.put(`/qc/${qcId}`, qcData);
  return response.qcRecord;
};