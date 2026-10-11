import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import Patients from "../pages/patients/Patients";
import { getPatients } from "../services/patientService";

vi.mock("../services/patientService", () => ({ getPatients: vi.fn() }));

describe("patient directory search", () => {
  beforeEach(() => { getPatients.mockResolvedValue([{ _id: "patient-1", patientId: "PAT-10", name: "Patient One", phone: "+911234567890", age: 31 }]); });
  test("filters existing records without changing the API data", async () => {
    render(<MemoryRouter><Patients /></MemoryRouter>);
    expect(await screen.findByText("Patient One")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search patient directory" }), { target: { value: "PAT-10" } });
    expect(screen.getByText("Patient One")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search patient directory" }), { target: { value: "missing" } });
    expect(screen.getByText("No patients match your search.")).toBeInTheDocument();
  });
});
