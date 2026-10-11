import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { beforeEach, describe, expect, test } from "vitest";
import ProtectedRoute from "../routes/ProtectedRoute";

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

const renderProtectedRoute = () =>
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<div>Protected Dashboard</div>}
          />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );

describe("ProtectedRoute", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  test("redirects to login when token is missing", () => {
    sessionStorage.setItem("user", JSON.stringify({ role: "ADMIN" }));

    renderProtectedRoute();

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(sessionStorage.getItem("user")).toBeNull();
  });

  test("redirects to login when user data is missing", () => {
    sessionStorage.setItem(
      "token",
      createToken(Math.floor(Date.now() / 1000) + 3600)
    );

    renderProtectedRoute();

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(sessionStorage.getItem("token")).toBeNull();
  });

  test("redirects to login when token is expired", () => {
    sessionStorage.setItem(
      "token",
      createToken(Math.floor(Date.now() / 1000) - 60)
    );
    sessionStorage.setItem("user", JSON.stringify({ role: "ADMIN" }));

    renderProtectedRoute();

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(sessionStorage.getItem("token")).toBeNull();
    expect(sessionStorage.getItem("user")).toBeNull();
  });

  test("redirects to login when token is malformed", () => {
    sessionStorage.setItem("token", "test-token");
    sessionStorage.setItem("user", JSON.stringify({ role: "ADMIN" }));

    renderProtectedRoute();

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  test("redirects to login when token has no expiration", () => {
    const encode = (value) =>
      btoa(JSON.stringify(value))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    sessionStorage.setItem(
      "token",
      `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ sub: "user-001" })}.test-signature`
    );
    sessionStorage.setItem("user", JSON.stringify({ role: "ADMIN" }));

    renderProtectedRoute();

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  test("renders protected content when token is not expired and user exists", () => {
    sessionStorage.setItem(
      "token",
      createToken(Math.floor(Date.now() / 1000) + 3600)
    );
    sessionStorage.setItem(
      "user",
      JSON.stringify({ id: "user-001", role: "ADMIN" })
    );

    renderProtectedRoute();

    expect(screen.getByText("Protected Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });

  test("clears corrupted user data", () => {
    sessionStorage.setItem(
      "token",
      createToken(Math.floor(Date.now() / 1000) + 3600)
    );
    sessionStorage.setItem("user", "{invalid-json");

    renderProtectedRoute();

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(sessionStorage.getItem("token")).toBeNull();
    expect(sessionStorage.getItem("user")).toBeNull();
  });

  test("does not restore a legacy localStorage session", () => {
    localStorage.setItem(
      "token",
      createToken(Math.floor(Date.now() / 1000) + 3600)
    );
    localStorage.setItem("user", JSON.stringify({ role: "ADMIN" }));

    renderProtectedRoute();

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(sessionStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });
});
