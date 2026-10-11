import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import GlobalSearch from "../components/layout/GlobalSearch";
import { searchCases } from "../services/searchService";

vi.mock("../services/searchService", () => ({ searchCases: vi.fn() }));

describe("global case search", () => {
  beforeEach(() => vi.clearAllMocks());

  test("debounces a query and links to a matching authorized case", async () => {
    searchCases.mockResolvedValue([{ type: "CASE", id: "case-1", label: "CASE-10", description: "Patient One · Biopsy", href: "/cases/CASE-10" }]);
    render(<MemoryRouter><GlobalSearch /></MemoryRouter>);
    fireEvent.change(screen.getByRole("searchbox", { name: "Search cases" }), { target: { value: "CASE" } });
    expect(await screen.findByRole("option")).toHaveTextContent("CASE-10");
    expect(screen.getByRole("option")).toHaveAttribute("href", "/cases/CASE-10");
  });

  test("renders service errors without hiding the query control", async () => {
    searchCases.mockRejectedValue(new Error("Search unavailable"));
    render(<MemoryRouter><GlobalSearch /></MemoryRouter>);
    fireEvent.change(screen.getByRole("searchbox", { name: "Search cases" }), { target: { value: "case" } });
    expect(await screen.findByRole("alert")).toHaveTextContent("Search unavailable");
  });
});
