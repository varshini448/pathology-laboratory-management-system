import { api } from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response;
};

export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);

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
