const API_URL = "http://localhost:5001";

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`);
    return response.json();
  },
};
