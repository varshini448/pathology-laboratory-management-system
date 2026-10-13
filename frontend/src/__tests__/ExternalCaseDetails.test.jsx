import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import DoctorCaseDetails from "../pages/external/DoctorCaseDetails";
import PatientCaseDetails from "../pages/external/PatientCaseDetails";
import { getDoctorDashboard, getPatientDashboard } from "../services/externalDashboardService";

vi.mock("../services/externalDashboardService", () => ({
  getDoctorDashboard: vi.fn(),
  getPatientDashboard: vi.fn(),
}));

const dashboard = {
  cases: [{
    _id: "case-db-id",
    caseId: "CASE-OWNED",
    caseType: "Biopsy",
    status: "IN_PROCESS",
    priority: "NORMAL",
    createdAt: "2025-01-01T00:00:00.000Z",
    patient: { name: "Assigned Patient" },
  }],
  reports: [{
    _id: "report-id",
    reportId: "RPT-FINAL",
    reportStatus: "FINAL",
    diagnosis: "Final result",
    case: { caseId: "CASE-OWNED" },
  }],
};

describe("external case details", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getDoctorDashboard.mockResolvedValue(dashboard);
    getPatientDashboard.mockResolvedValue(dashboard);
  });

  test("shows an assigned case and its finalized report for a doctor", async () => {
    render(
      <MemoryRouter initialEntries={["/doctor/cases/CASE-OWNED"]}>
        <Routes><Route path="/doctor/cases/:caseId" element={<DoctorCaseDetails />} /></Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: "CASE-OWNED" })).toBeInTheDocument();
    expect(screen.getByText("Assigned Patient")).toBeInTheDocument();
    expect(screen.getByText("Final result")).toBeInTheDocument();
    expect(getDoctorDashboard).toHaveBeenCalledTimes(1);
    expect(getPatientDashboard).not.toHaveBeenCalled();
  });

  test("does not resolve an unknown patient case from another URL identifier", async () => {
    render(
      <MemoryRouter initialEntries={["/patient/cases/CASE-OTHER"]}>
        <Routes><Route path="/patient/cases/:caseId" element={<PatientCaseDetails />} /></Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: "Case not found" })).toBeInTheDocument();
    expect(screen.queryByText("Assigned Patient")).not.toBeInTheDocument();
    expect(getPatientDashboard).toHaveBeenCalledTimes(1);
  });
});
