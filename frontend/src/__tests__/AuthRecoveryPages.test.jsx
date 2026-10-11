import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import { resetPassword, verifyEmailToken } from "../services/authService";

vi.mock("../services/authService", () => ({
  resetPassword: vi.fn(),
  verifyEmailToken: vi.fn(),
}));

describe("authentication recovery pages", () => {
  let consoleLog;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLog.mockRestore();
  });

  test("forgot password does not claim success when secure delivery is unavailable", () => {
    render(<MemoryRouter><ForgotPassword /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText("Email or Employee/Medical ID"), {
      target: { value: "person@example.test" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send Reset Instructions" }));

    expect(screen.getByText(/password reset delivery is not configured/i)).toBeInTheDocument();
    expect(screen.queryByText(/instructions will be sent/i)).not.toBeInTheDocument();
    expect(consoleLog).not.toHaveBeenCalled();
  });

  test("reset password shows success only after backend accepts the token", async () => {
    resetPassword.mockResolvedValue({ message: "Password has been reset successfully." });
    render(
      <MemoryRouter initialEntries={["/reset-password/synthetic-reset-token"]}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "synthetic-test-password" },
    });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), {
      target: { value: "synthetic-test-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    await waitFor(() => expect(resetPassword).toHaveBeenCalledWith({
      token: "synthetic-reset-token",
      password: "synthetic-test-password",
    }));
    expect(await screen.findByText("Password has been reset successfully.")).toBeInTheDocument();
    expect(consoleLog).not.toHaveBeenCalled();
  });

  test("email verification waits for the backend and does not log its token", async () => {
    verifyEmailToken.mockResolvedValue({ message: "Email verified successfully." });
    render(
      <MemoryRouter initialEntries={["/verify-email/synthetic-verification-token"]}>
        <Routes>
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(verifyEmailToken).toHaveBeenCalledWith("synthetic-verification-token"));
    expect(await screen.findByText("Email verified successfully.")).toBeInTheDocument();
    expect(consoleLog).not.toHaveBeenCalled();
  });
});
