import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import TechnicianDashboard from "../pages/dashboard/TechnicianDashboard";
import { getCases } from "../services/caseService";
import { getSpecimens } from "../services/specimenService";
import { getBlocks } from "../services/blockService";
import { getSlides } from "../services/slideService";

vi.mock("../services/caseService", () => ({ getCases: vi.fn() }));
vi.mock("../services/specimenService", () => ({ getSpecimens: vi.fn() }));
vi.mock("../services/blockService", () => ({ getBlocks: vi.fn() }));
vi.mock("../services/slideService", () => ({ getSlides: vi.fn() }));

describe("technician operational dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCases.mockResolvedValue([{ _id: "case-1", caseId: "CASE-10", status: "IN_PROCESS", caseType: "Biopsy" }]);
    getSpecimens.mockResolvedValue([]);
    getBlocks.mockResolvedValue([]);
    getSlides.mockResolvedValue([]);
  });

  test("shows live summary values, queues, and existing workflow actions", async () => {
    render(<MemoryRouter><TechnicianDashboard /></MemoryRouter>);
    expect(await screen.findByRole("heading", { name: "Technician Dashboard" })).toBeInTheDocument();
    expect(await screen.findByText("CASE-10")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "CASE-10" })).toHaveAttribute("href", "/cases/CASE-10");
    expect(screen.getByRole("link", { name: /Add specimen/ })).toHaveAttribute("href", "/specimens/add");
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
