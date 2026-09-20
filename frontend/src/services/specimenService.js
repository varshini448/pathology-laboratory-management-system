import { api } from "./api";

export const getSpecimens = async () => {
  const response = await api.get("/specimens");
  return response.specimens;
};

export const getSpecimensByCase = async (caseId) => {
  const response = await api.get(`/specimens/case/${caseId}`);
  return response.specimens;
};

export const getSpecimenById = async (specimenId) => {
  const response = await api.get(`/specimens/${specimenId}`);
  return response.specimen;
};

export const createSpecimen = async (specimenData) => {
  const response = await api.post("/specimens", specimenData);
  return response.specimen;
};

export const updateSpecimen = async (specimenId, specimenData) => {
  const response = await api.put(
    `/specimens/${specimenId}`,
    specimenData
  );
  return response.specimen;
};