import { api } from "./api";

export const getPendingApprovals = async () => {
  return await api.get("/users/admin/pending-approvals");
};

export const approveUser = async (userId) => {
  return await api.put(`/users/admin/users/${userId}/approve`);
};

export const rejectUser = async (userId) => {
  return await api.put(`/users/admin/users/${userId}/reject`);
};
