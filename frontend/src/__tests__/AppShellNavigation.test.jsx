import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import AppShell from "../layouts/AppShell";
import { getCurrentUser, logoutUser } from "../services/authService";
import { getNotifications } from "../services/notificationService";

vi.mock("../services/authService", () => ({ getCurrentUser: vi.fn(), logoutUser: vi.fn() }));
vi.mock("../services/notificationService", () => ({ getNotifications: vi.fn(), markAllNotificationsAsRead: vi.fn(), markNotificationAsRead: vi.fn() }));

const renderShell = () => render(<MemoryRouter initialEntries={["/admin-dashboard"]}><Routes><Route element={<AppShell />}><Route path="/admin-dashboard" element={<h1>Admin content</h1>} /></Route></Routes></MemoryRouter>);

describe("application shell access links", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCurrentUser.mockReturnValue({ name: "Admin", role: "ADMIN" });
    getNotifications.mockResolvedValue({ notifications: [], unreadCount: 0 });
  });

  test("shows working search, notifications, and admin directory navigation", async () => {
    renderShell();
    expect(screen.getByRole("searchbox", { name: "Search cases" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Notifications" })).toBeEnabled();
    expect(screen.getByRole("link", { name: /Patient Directory/ })).toHaveAttribute("href", "/patients");
    expect(screen.getByRole("link", { name: /Doctor Directory/ })).toHaveAttribute("href", "/doctors");
    expect(await screen.findByRole("heading", { name: "Admin content" })).toBeInTheDocument();
  });

  test("does not expose admin directories or global search to a technician", () => {
    getCurrentUser.mockReturnValue({ name: "Tech", role: "TECHNICIAN" });
    renderShell();
    expect(screen.getByRole("searchbox", { name: "Search cases" })).toBeEnabled();
    expect(screen.queryByRole("link", { name: /Doctor Directory/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Patient Directory/ })).not.toBeInTheDocument();
  });

  test("shows doctor case and report destinations", async () => {
    getCurrentUser.mockReturnValue({ name: "Doctor", role: "DOCTOR" });
    renderShell();
    expect(screen.getByRole("link", { name: /Assigned Cases/ })).toHaveAttribute("href", "/doctor-dashboard#assigned-cases");
    await screen.findByRole("heading", { name: "Admin content" });
    expect(screen.getByRole("link", { name: /Reports/ })).toHaveAttribute("href", "/doctor-dashboard#assigned-reports");
  });

  test("shows patient case and finalized report destinations", async () => {
    getCurrentUser.mockReturnValue({ name: "Patient", role: "PATIENT" });
    renderShell();
    await screen.findByRole("heading", { name: "Admin content" });
    expect(screen.getByRole("link", { name: /My Pathology Cases/ })).toHaveAttribute("href", "/patient-dashboard#my-cases");
    expect(screen.getByRole("link", { name: /Finalized Reports/ })).toHaveAttribute("href", "/patient-dashboard#final-reports");
  });
});
