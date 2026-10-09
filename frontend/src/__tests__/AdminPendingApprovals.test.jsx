import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach } from "vitest";
import AdminPendingApprovals from "../pages/dashboard/AdminPendingApprovals";
import {
  getPendingApprovals,
  approveUser,
  rejectUser,
} from "../services/userService";

vi.mock("../services/userService", () => ({
  getPendingApprovals: vi.fn(),
  approveUser: vi.fn(),
  rejectUser: vi.fn(),
}));

describe("AdminPendingApprovals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("shows pending users returned by the service", async () => {
    getPendingApprovals.mockResolvedValue({
      users: [
        {
          _id: "user-1",
          name: "Test Technician",
          email: "technician@test.com",
          role: "TECHNICIAN",
          department: "Histology",
          profile: { employeeId: "EMP-001" },
        },
      ],
    });

    render(<AdminPendingApprovals />);

    expect(
      await screen.findByText("Test Technician")
    ).toBeInTheDocument();

    expect(screen.getByText("technician@test.com")).toBeInTheDocument();
    expect(screen.getByText("TECHNICIAN")).toBeInTheDocument();
    expect(getPendingApprovals).toHaveBeenCalledTimes(1);
  });

  test("shows an empty state when there are no pending users", async () => {
    getPendingApprovals.mockResolvedValue({ users: [] });

    render(<AdminPendingApprovals />);

    expect(
      await screen.findByText(
        "No internal users are currently waiting for approval."
      )
    ).toBeInTheDocument();
  });

  test("approves a user and removes them from the list", async () => {
    getPendingApprovals.mockResolvedValue({
      users: [
        {
          _id: "user-1",
          name: "Test Technician",
          email: "technician@test.com",
          role: "TECHNICIAN",
        },
      ],
    });
    approveUser.mockResolvedValue({ message: "User approved successfully" });

    render(<AdminPendingApprovals />);

    await screen.findByText("Test Technician");
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));

    await waitFor(() => {
      expect(approveUser).toHaveBeenCalledWith("user-1");
      expect(screen.queryByText("Test Technician")).not.toBeInTheDocument();
    });

    expect(
      screen.getByText("User approved successfully")
    ).toBeInTheDocument();
  });

  test("rejects a user and removes them from the list", async () => {
    getPendingApprovals.mockResolvedValue({
      users: [
        {
          _id: "user-2",
          name: "Test Pathologist",
          email: "pathologist@test.com",
          role: "PATHOLOGIST",
        },
      ],
    });
    rejectUser.mockResolvedValue({ message: "User rejected successfully" });

    render(<AdminPendingApprovals />);

    await screen.findByText("Test Pathologist");
    fireEvent.click(screen.getByRole("button", { name: "Reject" }));

    await waitFor(() => {
      expect(rejectUser).toHaveBeenCalledWith("user-2");
      expect(screen.queryByText("Test Pathologist")).not.toBeInTheDocument();
    });

    expect(
      screen.getByText("User rejected successfully")
    ).toBeInTheDocument();
  });

  test("displays an error when loading pending approvals fails", async () => {
    getPendingApprovals.mockRejectedValue(
      new Error("Unable to load approvals")
    );

    render(<AdminPendingApprovals />);

    expect(
      await screen.findByText("Unable to load approvals")
    ).toBeInTheDocument();
  });
});
