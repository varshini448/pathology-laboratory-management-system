import { api } from "./api";

export const getPatients = async () => {
  const response = await api.get("/patients");
  return response.patients;
};

export const getPatientById = async (patientId) => {
  const response = await api.get(`/patients/${patientId}`);
  return response.patient;
};

export const createPatient = async (patientData) => {
  const response = await api.post("/patients", patientData);
  return response.patient;
};

export const updatePatient = async (patientId, patientData) => {
  const response = await api.put(
    `/patients/${patientId}`,
    patientData
  );
  return response.patient;
};