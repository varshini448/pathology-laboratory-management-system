import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import TATDashboard from "../pages/tat/TATDashboard";
import TATRoutes from "../routes/routeGroups/TATRoutes";
import QCRoutes from "../routes/routeGroups/QCRoutes";
import { getAllCaseTAT } from "../services/tatService";
import { getQCRecords } from "../services/qcService";

vi.mock("../services/tatService", () => ({
  getAllCaseTAT: vi.fn(),
  getCaseTAT: vi.fn(),
  getStageTAT: vi.fn(),
}));
vi.mock("../services/qcService", () => ({ getQCRecords: vi.fn() }));

const caseTAT = {
  caseId: "CASE-101",
  patient: { name: "Patient One" },
  doctor: { name: "Doctor One" },
  priority: "NORMAL",
  caseStatus: "IN_PROCESS",
  tatMinutes: 90,
  targetMinutes: 4320,
  isCompleted: false,
  tatStatus: "IN_PROGRESS",
};

const renderTatRoutes = () => render(
  <MemoryRouter initialEntries={["/tat"]}>
    <Routes>
      {TATRoutes}
      <Route path="/unauthorized" element={<p>Access not available</p>} />
    </Routes>
  </MemoryRouter>
);

describe("TAT dashboard and access", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    getAllCaseTAT.mockResolvedValue([caseTAT]);
    getQCRecords.mockResolvedValue([]);
  });

  test("renders API-backed elapsed time and explains the configured thresholds", async () => {
    render(<MemoryRouter><TATDashboard /></MemoryRouter>);

    expect(await screen.findByText("CASE-101")).toBeInTheDocument();
    expect(screen.getByText(/not a predictive model or a clinical standard/i)).toBeInTheDocument();
    expect(screen.getByText("1 hr 30 min")).toBeInTheDocument();
  });

  test("shows loading and empty states without invented records", async () => {
    getAllCaseTAT.mockResolvedValueOnce([]);
    render(<MemoryRouter><TATDashboard /></MemoryRouter>);

    expect(screen.getByText("Loading turnaround time data...")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "No cases available" })).toBeInTheDocument();
    expect(screen.queryByText("CASE-101")).not.toBeInTheDocument();
  });

  test("retries a failed TAT request without a full page reload", async () => {
    getAllCaseTAT.mockRejectedValueOnce(new Error("Service unavailable"));
    render(<MemoryRouter><TATDashboard /></MemoryRouter>);

    expect(await screen.findByRole("heading", { name: "Unable to load TAT data" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(await screen.findByText("CASE-101")).toBeInTheDocument();
    await waitFor(() => expect(getAllCaseTAT).toHaveBeenCalledTimes(2));
  });

  test("keeps the TAT routes limited to backend-authorized internal roles", async () => {
    sessionStorage.setItem("user", JSON.stringify({ role: "DOCTOR" }));
    renderTatRoutes();
    expect(await screen.findByText("Access not available")).toBeInTheDocument();
    expect(getAllCaseTAT).not.toHaveBeenCalled();
  });

  test("keeps QC routes limited to backend-authorized roles", async () => {
    sessionStorage.setItem("user", JSON.stringify({ role: "PATIENT" }));
    render(
      <MemoryRouter initialEntries={["/qc"]}>
        <Routes>
          {QCRoutes}
          <Route path="/unauthorized" element={<p>Access not available</p>} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Access not available")).toBeInTheDocument();
    expect(getQCRecords).not.toHaveBeenCalled();
  });

  test("shows stored QC data to technicians without an unauthorized create action", async () => {
    sessionStorage.setItem("user", JSON.stringify({ role: "TECHNICIAN" }));
    const { container } = render(
      <MemoryRouter initialEntries={["/qc"]}>
        <Routes>
          {QCRoutes}
          <Route path="/unauthorized" element={<p>Access not available</p>} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: "Quality Assurance Center" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Add QC record" })).not.toBeInTheDocument();
    expect(container.querySelectorAll('a[href="/qc/add"]')).toHaveLength(0);
    expect(getQCRecords).toHaveBeenCalledOnce();
  });
});
