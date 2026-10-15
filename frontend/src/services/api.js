import { getAuthToken } from "../utils/authStorage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const getToken = getAuthToken;

const isAuthenticationEndpoint = (endpoint) =>
  /^\/(auth|external-auth)\/(login|register)(\/|$)/.test(endpoint);

const notifySessionExpired = (endpoint, token) => {
  if (
    token &&
    !isAuthenticationEndpoint(endpoint)
  ) {
    window.dispatchEvent(new Event("auth:expired"));
  }
};

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(!isFormData && options.body !== undefined
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      notifySessionExpired(endpoint, token);
    }

    throw new Error(data.message || "API request failed");
  }

  return data;
};

const getBlob = async (endpoint) => {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      notifySessionExpired(endpoint, token);
    }

    throw new Error(data.message || "Failed to load image");
  }

  return response.blob();
};

export const api = {
  get: async (endpoint) => request(endpoint),

  post: async (endpoint, body) =>
    request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  upload: async (endpoint, formData) =>
    request(endpoint, {
      method: "POST",
      body: formData,
    }),

  getBlob,

  put: async (endpoint, body) =>
    request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: async (endpoint) =>
    request(endpoint, { method: "DELETE" }),
};
