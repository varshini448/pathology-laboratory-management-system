import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";
import AdminDashboardManagement from "../pages/dashboard/AdminDashboardManagement";

vi.mock("../pages/dashboard/AdminPendingApprovals", () => ({ default: () => null }));
vi.mock("../pages/dashboard/AdminRecentActivity", () => ({ default: () => null }));

describe("administration destinations", () => {
  test("links all six intended administration destinations", () => {
    render(<MemoryRouter><AdminDashboardManagement /></MemoryRouter>);

    const destinations = [
      ["Manage users", "/users"],
      ["Add staff user", "/users/add"],
      ["Review approvals", "/admin/pending-approvals"],
      ["Audit logs", "/audit-logs"],
      ["Quality records", "/qc/records"],
      ["Workflow configuration", "/admin/workflow-configuration"],
    ];

    for (const [label, href] of destinations) {
      const matchingDestination = screen
        .getAllByRole("link", { name: new RegExp(label, "i") })
        .some((link) => link.getAttribute("href") === href);
      expect(matchingDestination, `${label} should point to ${href}`).toBe(true);
    }
  });
});
