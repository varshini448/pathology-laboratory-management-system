import { api } from "./api";

export const uploadFile = async (endpoint, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:5001${endpoint}`, {
    method: "POST",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "File upload failed");
  }

  return data;
};

export const deleteFile = async (endpoint) => {
  return api.delete(endpoint);
};