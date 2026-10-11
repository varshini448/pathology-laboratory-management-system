import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import Dashboard from "../pages/dashboard/Dashboard";
import { getAuthUser } from "../utils/authStorage";

vi.mock("../utils/authStorage", () => ({ getAuthUser: vi.fn() }));

const renderDashboard = () => render(
  <MemoryRouter initialEntries={["/dashboard"]}>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/patient-dashboard" element={<p>Patient dashboard</p>} />
      <Route path="/doctor-dashboard" element={<p>Doctor dashboard</p>} />
      <Route path="/admin-dashboard" element={<p>Admin dashboard</p>} />
      <Route path="/unauthorized" element={<p>Unauthorized</p>} />
    </Routes>
  </MemoryRouter>
);

describe("Dashboard role routing", () => {
  beforeEach(() => vi.clearAllMocks());

  test("routes patient accounts represented by userType", () => {
    getAuthUser.mockReturnValue({ userType: "PATIENT" });
    renderDashboard();
    expect(screen.getByText("Patient dashboard")).toBeInTheDocument();
  });

  test("routes doctor accounts represented by userType", () => {
    getAuthUser.mockReturnValue({ userType: "DOCTOR" });
    renderDashboard();
    expect(screen.getByText("Doctor dashboard")).toBeInTheDocument();
  });

  test("keeps internal role routing", () => {
    getAuthUser.mockReturnValue({ role: "ADMIN" });
    renderDashboard();
    expect(screen.getByText("Admin dashboard")).toBeInTheDocument();
  });
});
