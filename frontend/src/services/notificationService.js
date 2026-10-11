import { api } from "./api";

export const getNotifications = async () => api.get("/notifications?limit=8&page=1");

export const markNotificationAsRead = async (id) =>
  api.put(`/notifications/${encodeURIComponent(id)}/read`, {});

export const markAllNotificationsAsRead = async () =>
  api.put("/notifications/read-all", {});
