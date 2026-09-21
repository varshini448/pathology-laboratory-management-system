import { api } from "./api";

export const getReports = async () => {
  const response = await api.get("/reports");
  return response.reports;
};

export const getReportsByCase = async (caseId) => {
  const response = await api.get(`/reports/case/${caseId}`);
  return response.reports;
};

export const generateReportData = async (caseId) => {
  const response = await api.get(`/reports/generate/${caseId}`);
  return response.reportData;
};


export const getReportById = async (reportId) => {
  const response = await api.get(`/reports/${reportId}`);
  return response.report;
};

export const createReport = async (reportData) => {
  const response = await api.post("/reports", reportData);
  return response.report;
};

export const updateReport = async (reportId, reportData) => {
  const response = await api.put(`/reports/${reportId}`, reportData);
  return response.report;
};