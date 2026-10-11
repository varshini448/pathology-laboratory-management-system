import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import GuestRoute from "../routes/GuestRoute";

const createToken = (expirationSeconds) => {
  const encode = (value) =>
    btoa(JSON.stringify(value))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

  return [
    encode({ alg: "HS256", typ: "JWT" }),
    encode({ exp: expirationSeconds }),
    "test-signature",
  ].join(".");
};

const renderGuestRoute = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/register" element={<div>Register Page</div>} />
        </Route>
        <Route path="/dashboard" element={<div>Dashboard Page</div>} />
      </Routes>
    </MemoryRouter>
  );

describe("GuestRoute", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  test("shows the login page when signed out", () => {
    renderGuestRoute("/login");

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  test("shows the registration selector when signed out", () => {
    renderGuestRoute("/register");

    expect(screen.getByText("Register Page")).toBeInTheDocument();
  });

  test("redirects an authenticated session to the dashboard", () => {
    sessionStorage.setItem(
      "token",
      createToken(Math.floor(Date.now() / 1000) + 3600)
    );
    sessionStorage.setItem("user", JSON.stringify({ role: "ADMIN" }));

    renderGuestRoute("/login");

    expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
  });

  test("does not restore an authenticated session from localStorage", () => {
    localStorage.setItem(
      "token",
      createToken(Math.floor(Date.now() / 1000) + 3600)
    );
    localStorage.setItem("user", JSON.stringify({ role: "ADMIN" }));

    renderGuestRoute("/register");

    expect(screen.getByText("Register Page")).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });
});
