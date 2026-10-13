import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import TATRoutes from "../routes/routeGroups/TATRoutes";
import WorkflowBottlenecks from "../pages/workflow/WorkflowBottlenecks";
import { getWorkflowBottlenecks } from "../services/workflowService";

vi.mock("../services/workflowService", () => ({
  getWorkflowBottlenecks: vi.fn(),
  getWorkflowEventsByCase: vi.fn(),
  createWorkflowEvent: vi.fn(),
}));

const delayedResult = {
  generatedAt: "2026-10-12T04:00:00.000Z",
  method: "Rules-based",
  delayedCaseCount: 1,
  unmeasurableCaseCount: 0,
  stages: [{
    stage: "SPECIMEN_COLLECTION",
    thresholdMinutes: 120,
    delayedCaseCount: 1,
    delayedCases: [{
      caseId: "CASE-101",
      caseStatus: "IN_PROCESS",
      priority: "URGENT",
      startedAt: "2026-10-12T01:00:00.000Z",
      elapsedMinutes: 180,
      thresholdMinutes: 120,
      reason: "Specimen Collection has remained in progress for 180 minutes, exceeding its 120-minute configured threshold.",
    }],
  }],
};

const renderRoutes = (path = "/workflow/bottlenecks") => render(
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      {TATRoutes}
      <Route path="/unauthorized" element={<p>Access not available</p>} />
    </Routes>
  </MemoryRouter>
);

describe("workflow bottleneck review", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    sessionStorage.setItem("user", JSON.stringify({ role: "TECHNICIAN" }));
    getWorkflowBottlenecks.mockResolvedValue(delayedResult);
  });

  test("renders actual measured delay details and links to the existing case page", async () => {
    render(<MemoryRouter><WorkflowBottlenecks /></MemoryRouter>);

    expect(await screen.findByRole("heading", { name: "Specimen Collection" })).toBeInTheDocument();
    expect(screen.getByText("1 delayed case")).toBeInTheDocument();
    expect(screen.getByText("3 hr")).toBeInTheDocument();
    expect(screen.getByText("2 hr")).toBeInTheDocument();
    expect(screen.getByText(/exceeding its 120-minute configured threshold/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "CASE-101" })).toHaveAttribute("href", "/cases/CASE-101");
    expect(screen.getByText(/rules-based monitoring only/i)).toBeInTheDocument();
  });

  test("shows loading, then a truthful empty result", async () => {
    let resolveRequest;
    getWorkflowBottlenecks.mockImplementationOnce(() => new Promise((resolve) => { resolveRequest = resolve; }));
    render(<MemoryRouter><WorkflowBottlenecks /></MemoryRouter>);

    expect(screen.getByRole("status")).toHaveTextContent(/loading workflow stage data/i);
    resolveRequest({ generatedAt: "2026-10-12T04:00:00.000Z", delayedCaseCount: 0, unmeasurableCaseCount: 0, stages: [] });
    expect(await screen.findByRole("heading", { name: "No delayed stages detected" })).toBeInTheDocument();
  });

  test("reports cases with incomplete timestamps as unmeasurable without flagging them", async () => {
    getWorkflowBottlenecks.mockResolvedValueOnce({
      generatedAt: "2026-10-12T04:00:00.000Z",
      delayedCaseCount: 0,
      unmeasurableCaseCount: 1,
      stages: [],
    });
    render(<MemoryRouter><WorkflowBottlenecks /></MemoryRouter>);

    expect(await screen.findByText(/1 open case has missing or inconsistent workflow timestamps/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "No delayed stages detected" })).toBeInTheDocument();
  });

  test("shows an error state and retries the failed request", async () => {
    getWorkflowBottlenecks
      .mockRejectedValueOnce(new Error("Database failure"))
      .mockResolvedValueOnce(delayedResult);
    render(<MemoryRouter><WorkflowBottlenecks /></MemoryRouter>);

    expect(await screen.findByRole("heading", { name: "Unable to evaluate workflow stages" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByRole("heading", { name: "Specimen Collection" })).toBeInTheDocument();
    await waitFor(() => expect(getWorkflowBottlenecks).toHaveBeenCalledTimes(2));
  });

  test("shows a distinct unavailable state for connection failures", async () => {
    const networkError = new TypeError("Failed to fetch");
    getWorkflowBottlenecks.mockRejectedValueOnce(networkError);
    render(<MemoryRouter><WorkflowBottlenecks /></MemoryRouter>);

    expect(await screen.findByRole("heading", { name: "Detection service unavailable" })).toBeInTheDocument();
  });

  test("route guard blocks external roles before requesting operational data", async () => {
    sessionStorage.setItem("user", JSON.stringify({ userType: "PATIENT" }));
    renderRoutes();

    expect(await screen.findByText("Access not available")).toBeInTheDocument();
    expect(getWorkflowBottlenecks).not.toHaveBeenCalled();
  });
});
