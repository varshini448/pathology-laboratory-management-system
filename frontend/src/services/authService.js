import { api } from "./api";
import {
  clearAuthSession,
  getAuthUser,
  storeAuthSession,
} from "../utils/authStorage";

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

export const resetPassword = async (resetData) => {
  return api.post("/password-reset/reset", resetData);
};

export const verifyEmailToken = async (token) => {
  return api.post("/email-verification/verify", { token });
};

export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);

  storeAuthSession(response.token, response.user);

  return response;
};

export const loginPatient = async (loginData) => {
  const response = await api.post(
    "/external-auth/patient/login",
    loginData
  );

  storeAuthSession(response.token, response.user);

  return response;
};

export const loginDoctor = async (loginData) => {
  const response = await api.post(
    "/external-auth/doctor/login",
    loginData
  );

  storeAuthSession(response.token, response.user);

  return response;
};

export const logoutUser = () => {
  clearAuthSession();
};

export const getCurrentUser = () => {
  return getAuthUser();
};
