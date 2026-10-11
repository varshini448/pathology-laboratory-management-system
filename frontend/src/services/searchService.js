import { api } from "./api";

export const searchCases = async (query) => {
  const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
  return Array.isArray(response.results) ? response.results : [];
};
