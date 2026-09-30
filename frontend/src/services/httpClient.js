import { api } from "./api";

export const httpClient = {
  get: (endpoint) => api.get(endpoint),

  post: (endpoint, body) => api.post(endpoint, body),

  put: (endpoint, body) => api.put(endpoint, body),

  delete: (endpoint) => api.delete(endpoint),
};

export default httpClient;