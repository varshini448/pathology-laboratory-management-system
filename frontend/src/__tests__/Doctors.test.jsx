import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import Doctors from "../pages/doctors/Doctors";
import DoctorDetails from "../pages/doctors/DoctorDetails";
import { getDoctors, getDoctorById } from "../services/doctorService";

vi.mock("../services/doctorService", () => ({ getDoctors: vi.fn(), getDoctorById: vi.fn() }));

describe("admin doctor directory pages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getDoctors.mockResolvedValue([{ _id: "doc-1", doctorId: "DOC-10", name: "Dr One", specialization: "Pathology", hospital: "City Lab", status: "ACTIVE" }]);
    getDoctorById.mockResolvedValue({ _id: "doc-1", doctorId: "DOC-10", name: "Dr One", specialization: "Pathology", qualification: "MD", email: "doctor@example.test", status: "ACTIVE" });
  });

  test("filters directory results by searchable fields", async () => {
    render(<MemoryRouter><Doctors /></MemoryRouter>);
    expect(await screen.findByText("Dr One")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search doctors" }), { target: { value: "City" } });
    expect(screen.getByText("Dr One")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search doctors" }), { target: { value: "no match" } });
    expect(screen.getByText("No doctors match your search.")).toBeInTheDocument();
  });

  test("loads doctor professional details", async () => {
    render(<MemoryRouter initialEntries={["/doctors/doc-1"]}><Routes><Route path="/doctors/:id" element={<DoctorDetails />} /></Routes></MemoryRouter>);
    expect(await screen.findByRole("heading", { name: "Dr One" })).toBeInTheDocument();
    expect(screen.getByText("MD")).toBeInTheDocument();
  });
});
