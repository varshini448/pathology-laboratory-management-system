import { beforeEach, describe, expect, test, vi } from "vitest";
import { api } from "../services/api";
import {
  getCurrentUser,
  loginDoctor,
  loginPatient,
  loginUser,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  verifyEmailToken,
} from "../services/authService";

vi.mock("../services/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

describe("authService session storage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.clearAllMocks();
  });

  test.each([
    ["internal user", loginUser, "/auth/login", { id: "user-1", role: "ADMIN" }],
    ["patient", loginPatient, "/external-auth/patient/login", { id: "patient-1", userType: "PATIENT" }],
    ["doctor", loginDoctor, "/external-auth/doctor/login", { id: "doctor-1", userType: "DOCTOR" }],
  ])("stores %s authentication in sessionStorage", async (_label, login, endpoint, user) => {
    const response = {
      token: "session-token",
      user,
    };
    api.post.mockResolvedValue(response);

    await login({ identifier: "test-user", password: "test-password" });

    expect(api.post).toHaveBeenCalledWith(endpoint, expect.any(Object));
    expect(sessionStorage.getItem("token")).toBe(response.token);
    expect(JSON.parse(sessionStorage.getItem("user"))).toEqual(response.user);
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  test("does not restore a user from legacy localStorage", () => {
    localStorage.setItem("user", JSON.stringify({ role: "ADMIN" }));

    expect(getCurrentUser()).toBeNull();
  });

  test("posts reset data to the token-validated backend endpoint", async () => {
    const response = { message: "Password has been reset successfully." };
    api.post.mockResolvedValue(response);

    await expect(resetPassword({ token: "synthetic-reset-token", password: "synthetic-test-password" }))
      .resolves.toEqual(response);
    expect(api.post).toHaveBeenCalledWith("/password-reset/reset", {
      token: "synthetic-reset-token",
      password: "synthetic-test-password",
    });
  });

  test("posts reset requests to the backend without assuming delivery succeeded", async () => {
    const request = {
      accountType: "external",
      identifier: "doctor@example.test",
    };
    api.post.mockResolvedValue({ message: "Password reset delivery is not configured." });

    await expect(requestPasswordReset(request)).resolves.toEqual({
      message: "Password reset delivery is not configured.",
    });
    expect(api.post).toHaveBeenCalledWith("/password-reset/request", request);
  });

  test("posts email verification token to the backend endpoint", async () => {
    const response = { message: "Email verified successfully." };
    api.post.mockResolvedValue(response);

    await expect(verifyEmailToken("synthetic-verification-token")).resolves.toEqual(response);
    expect(api.post).toHaveBeenCalledWith("/email-verification/verify", {
      token: "synthetic-verification-token",
    });
  });

  test("logout clears session and legacy authentication keys", () => {
    sessionStorage.setItem("token", "session-token");
    sessionStorage.setItem("user", JSON.stringify({ role: "ADMIN" }));
    localStorage.setItem("token", "legacy-token");
    localStorage.setItem("user", JSON.stringify({ role: "ADMIN" }));

    logoutUser();

    expect(sessionStorage.getItem("token")).toBeNull();
    expect(sessionStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });
});
