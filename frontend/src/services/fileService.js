import { api } from "./api";
export const uploadFile = async (endpoint, file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api.upload(endpoint, formData);
};

export const deleteFile = async (endpoint) => {
  return api.delete(endpoint);
};
