import { api } from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response;
};

export const registerPatient = async (patientData) => {
  const response = await api.post(
    "/external-auth/patient/register",
    patientData
  );
  return response;
};

export const registerDoctor = async (doctorData) => {
  const response = await api.post(
    "/external-auth/doctor/register",
    doctorData
  );
  return response;
};

export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);

  localStorage.setItem("token", response.token);
  localStorage.setItem("user", JSON.stringify(response.user));

  return response;
};

export const loginPatient = async (loginData) => {
  const response = await api.post(
    "/external-auth/patient/login",
    loginData
  );

  localStorage.setItem("token", response.token);
  localStorage.setItem("user", JSON.stringify(response.user));

  return response;
};

export const loginDoctor = async (loginData) => {
  const response = await api.post(
    "/external-auth/doctor/login",
    loginData
  );

  localStorage.setItem("token", response.token);
  localStorage.setItem("user", JSON.stringify(response.user));

  return response;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};
