import { api } from "./api";

export const getPatientDashboard = async () => {
  return api.get("/external-dashboard/patient");
};

export const getDoctorDashboard = async () => {
  return api.get("/external-dashboard/doctor");
};
