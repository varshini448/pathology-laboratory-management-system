import { api } from "./api";

export const getDoctors = async () => {
  const response = await api.get("/doctors");
  return response.doctors;
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