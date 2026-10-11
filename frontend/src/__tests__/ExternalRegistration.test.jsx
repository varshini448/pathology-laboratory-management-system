import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import PatientRegister from "../pages/auth/PatientRegister";
import DoctorRegister from "../pages/auth/DoctorRegister";
import { registerPatient, registerDoctor } from "../services/authService";

vi.mock("../services/authService", () => ({
  registerPatient: vi.fn(),
  registerDoctor: vi.fn(),
}));

const setField = (label, value) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe("external account registration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("submits patient registration to the backend without confirmation password", async () => {
    registerPatient.mockResolvedValue({ message: "Patient registration successful" });
    render(<MemoryRouter><PatientRegister /></MemoryRouter>);

    setField("Full Name *", "Test Patient");
    setField("Date of Birth *", "1990-01-01");
    setField("Gender *", "FEMALE");
    setField("Mobile Number *", "+919876543210");
    setField("Password *", "safe-test-password");
    setField("Confirm Password *", "safe-test-password");
    fireEvent.click(screen.getByRole("button", { name: "Create Patient Account" }));

    await waitFor(() => expect(registerPatient).toHaveBeenCalledWith(expect.objectContaining({
      name: "Test Patient",
      phone: "+919876543210",
      gender: "FEMALE",
      password: "safe-test-password",
    })));
    expect(registerPatient.mock.calls[0][0]).not.toHaveProperty("confirmPassword");
    expect(await screen.findByText("Patient registration successful")).toBeInTheDocument();
  });

  test("omits the optional gender when the patient prefers not to say", async () => {
    registerPatient.mockResolvedValue({ message: "Patient registration successful" });
    render(<MemoryRouter><PatientRegister /></MemoryRouter>);

    setField("Full Name *", "Test Patient");
    setField("Date of Birth *", "1990-01-01");
    setField("Gender *", "PREFER_NOT_TO_SAY");
    setField("Mobile Number *", "+919876543210");
    setField("Password *", "safe-test-password");
    setField("Confirm Password *", "safe-test-password");
    fireEvent.click(screen.getByRole("button", { name: "Create Patient Account" }));

    await waitFor(() => expect(registerPatient).toHaveBeenCalled());
    expect(registerPatient.mock.calls[0][0]).not.toHaveProperty("gender");
  });

  test("submits doctor registration to the backend using the expected hospital field", async () => {
    registerDoctor.mockResolvedValue({
      message: "Registration submitted. Your account is pending professional verification.",
    });
    render(<MemoryRouter><DoctorRegister /></MemoryRouter>);

    setField("Full Name *", "Test Doctor");
    setField("Official Email *", "doctor@example.test");
    setField("Mobile Number *", "+919876543210");
    setField("Medical Registration ID *", "REG-TEST");
    setField("Registration Authority *", "Medical Council");
    setField("Qualification *", "MD");
    setField("Specialization *", "Pathology");
    setField("Hospital / Clinic Name *", "Test Clinic");
    setField("Password *", "safe-test-password");
    setField("Confirm Password *", "safe-test-password");
    fireEvent.click(screen.getByRole("button", { name: "Submit for Verification" }));

    await waitFor(() => expect(registerDoctor).toHaveBeenCalledWith(expect.objectContaining({
      name: "Test Doctor",
      email: "doctor@example.test",
      hospital: "Test Clinic",
      password: "safe-test-password",
    })));
    expect(registerDoctor.mock.calls[0][0]).not.toHaveProperty("confirmPassword");
    expect(registerDoctor.mock.calls[0][0]).not.toHaveProperty("hospitalName");
    expect(await screen.findByText(/pending professional verification/i)).toBeInTheDocument();
  });
});
