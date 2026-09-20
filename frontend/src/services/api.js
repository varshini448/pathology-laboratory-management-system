const API_URL = "http://localhost:5001";

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
};

export const api = {
  get: async (endpoint) => {
    return request(endpoint);
  },

  post: async (endpoint, body) => {
    return request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put: async (endpoint, body) => {
    return request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete: async (endpoint) => {
    return request(endpoint, {
      method: "DELETE",
    });
  },
};