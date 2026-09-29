import React, { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  loginPatient,
  loginDoctor,
  logoutUser,
  getCurrentUser,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (loginData) => {
    const response = await loginUser(loginData);

    setUser(response.user);

    return response;
  };

  const loginAsPatient = async (loginData) => {
    const response = await loginPatient(loginData);

    setUser(response.user);

    return response;
  };

  const loginAsDoctor = async (loginData) => {
    const response = await loginDoctor(loginData);

    setUser(response.user);

    return response;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        loginAsPatient,
        loginAsDoctor,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used inside an AuthProvider"
    );
  }

  return context;
};

export default AuthContext;