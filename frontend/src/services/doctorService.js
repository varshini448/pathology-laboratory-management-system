import { api } from "./api";

export const getDoctors = async () => {
  const response = await api.get("/doctors");
  return Array.isArray(response.doctors) ? response.doctors : [];
};

export const getDoctorById = async (doctorId) => {
  const response = await api.get(`/doctors/${doctorId}`);
  return response.doctor;
};

export const createDoctor = async (doctorData) => {
  const response = await api.post("/doctors", doctorData);
  return response.doctor;
};

export const updateDoctor = async (doctorId, doctorData) => {
  const response = await api.put(
    `/doctors/${doctorId}`,
    doctorData
  );
  return response.doctor;
};

export const getPendingDoctors = async () => {
  const response = await api.get("/doctor-verification/pending");
  return Array.isArray(response.doctors) ? response.doctors : [];
};

export const approveDoctor = async (doctorId) => {
  return api.put(`/doctor-verification/${doctorId}/approve`);
};

export const rejectDoctor = async (doctorId) => {
  return api.put(`/doctor-verification/${doctorId}/reject`);
};
