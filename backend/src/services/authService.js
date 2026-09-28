import { api } from "./api";

// ================================
// INTERNAL USER AUTHENTICATION
// ================================

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response;
};

export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);

  if (response.token) {
    localStorage.setItem("token", response.token);
  }

  if (response.user) {
    localStorage.setItem("user", JSON.stringify(response.user));
  }

  return response;
};

// ================================
// PATIENT AUTHENTICATION
// ================================

export const registerPatient = async (patientData) => {
  const response = await api.post(
    "/external-auth/patient/register",
    patientData
  );

  return response;
};

export const loginPatient = async (loginData) => {
  const response = await api.post(
    "/external-auth/patient/login",
    loginData
  );

  if (response.token) {
    localStorage.setItem("token", response.token);
  }

  if (response.patient) {
    localStorage.setItem("user", JSON.stringify(response.patient));
  }

  return response;
};

// ================================
// DOCTOR AUTHENTICATION
// ================================

export const registerDoctor = async (doctorData) => {
  const response = await api.post(
    "/external-auth/doctor/register",
    doctorData
  );

  return response;
};

export const loginDoctor = async (loginData) => {
  const response = await api.post(
    "/external-auth/doctor/login",
    loginData
  );

  if (response.token) {
    localStorage.setItem("token", response.token);
  }

  if (response.doctor) {
    localStorage.setItem("user", JSON.stringify(response.doctor));
  }

  return response;
};

// ================================
// LOGOUT
// ================================

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ================================
// CURRENT USER
// ================================

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};