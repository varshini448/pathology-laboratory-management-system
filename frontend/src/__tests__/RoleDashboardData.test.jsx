import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import PathologistDashboard from "../pages/dashboard/PathologistDashboard";
import QualityDashboard from "../pages/dashboard/QualityDashboard";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import PatientDashboard from "../pages/patient/PatientDashboard";
import { getCases } from "../services/caseService";
import { getPendingSignOutReports } from "../services/reportService";
import { getQCRecords } from "../services/qcService";
import { getDoctorDashboard, getPatientDashboard } from "../services/externalDashboardService";

vi.mock("../services/caseService", () => ({ getCases: vi.fn() }));
vi.mock("../services/reportService", () => ({ getPendingSignOutReports: vi.fn() }));
vi.mock("../services/qcService", () => ({ getQCRecords: vi.fn() }));
vi.mock("../services/externalDashboardService", () => ({ getDoctorDashboard: vi.fn(), getPatientDashboard: vi.fn() }));

describe("role dashboard data", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCases.mockResolvedValue([{ _id: "case-1", caseId: "CASE-1", status: "IN_PROCESS" }]);
    getPendingSignOutReports.mockResolvedValue([{ _id: "report-1", reportId: "RPT-1", reportStatus: "PENDING_SIGN_OUT" }]);
    getQCRecords.mockResolvedValue([{ _id: "qc-1", qcId: "QC-1", overallStatus: "PASSED" }]);
    getDoctorDashboard.mockResolvedValue({ account: { name: "Doctor" }, stats: { assignedCases: 1, distinctPatients: 1, activeCases: 1, finalReports: 0 }, cases: [{ _id: "case-1", caseId: "CASE-1", status: "IN_PROCESS", patient: { name: "Patient" } }], reports: [] });
    getPatientDashboard.mockResolvedValue({ account: { name: "Patient" }, stats: { totalCases: 1, activeCases: 1, finalReports: 0 }, cases: [{ _id: "case-1", caseId: "CASE-1", status: "IN_PROCESS" }], reports: [] });
  });

  test("pathologist and quality dashboards show API-backed queues", async () => {
    const view = render(<MemoryRouter><PathologistDashboard /></MemoryRouter>);
    expect(await screen.findByText("RPT-1")).toBeInTheDocument();
    view.unmount();
    render(<MemoryRouter><QualityDashboard /></MemoryRouter>);
    expect(await screen.findByText("QC-1")).toBeInTheDocument();
    expect(screen.getByText("PASSED")).toBeInTheDocument();
  });

  test("doctor and patient dashboards consume their account-scoped API data", async () => {
    const view = render(<MemoryRouter><DoctorDashboard /></MemoryRouter>);
    expect(await screen.findByText("CASE-1")).toBeInTheDocument();
    expect(getDoctorDashboard).toHaveBeenCalled();
    view.unmount();
    render(<MemoryRouter><PatientDashboard /></MemoryRouter>);
    expect(await screen.findByText("CASE-1")).toBeInTheDocument();
    expect(getPatientDashboard).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Refresh my records" }));
    await waitFor(() => expect(getPatientDashboard).toHaveBeenCalledTimes(2));
  });

  test("external dashboards retry their API request without a full page reload", async () => {
    getDoctorDashboard.mockRejectedValueOnce(new Error("Temporary service error"));
    render(<MemoryRouter><DoctorDashboard /></MemoryRouter>);

    expect(await screen.findByRole("alert")).toHaveTextContent("Temporary service error");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByText("CASE-1")).toBeInTheDocument();
    await waitFor(() => expect(getDoctorDashboard).toHaveBeenCalledTimes(2));
  });
});
