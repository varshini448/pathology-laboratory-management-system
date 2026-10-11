import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import NotificationMenu from "../components/layout/NotificationMenu";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../services/notificationService";

vi.mock("../services/notificationService", () => ({ getNotifications: vi.fn(), markAllNotificationsAsRead: vi.fn(), markNotificationAsRead: vi.fn() }));

describe("notification menu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getNotifications.mockResolvedValue({ unreadCount: 1, notifications: [{ _id: "note-1", title: "QC review pending", message: "Review the recorded control result.", isRead: false, createdAt: "2026-10-10T10:00:00Z" }] });
    markNotificationAsRead.mockResolvedValue({ notification: { _id: "note-1", title: "QC review pending", message: "Review the recorded control result.", isRead: true } });
    markAllNotificationsAsRead.mockResolvedValue({ modifiedCount: 1 });
  });

  test("loads real notifications and marks the owned item read", async () => {
    render(<MemoryRouter><NotificationMenu /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: /Notifications/ }));
    expect(await screen.findByText("QC review pending")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /QC review pending/ }));
    expect(await screen.findByText("Up to date")).toBeInTheDocument();
    expect(markNotificationAsRead).toHaveBeenCalledWith("note-1");
  });

  test("reports service failures in the panel", async () => {
    getNotifications.mockRejectedValue(new Error("Notifications unavailable"));
    render(<MemoryRouter><NotificationMenu /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: /Notifications/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Notifications unavailable");
  });
});
