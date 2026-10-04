import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";

describe("ProtectedRoute", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("redirects to login when token is missing", () => {
        render(
            <MemoryRouter initialEntries={["/dashboard"]}>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/dashboard"
                            element={<div>Protected Dashboard</div>}
                        />
                    </Route>

                    <Route
                        path="/login"
                        element={<div>Login Page</div>}
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Login Page")).toBeInTheDocument();
        expect(
            screen.queryByText("Protected Dashboard")
        ).not.toBeInTheDocument();
    });

    test("redirects to login when user data is missing", () => {
        localStorage.setItem("token", "test-token");

        render(
            <MemoryRouter initialEntries={["/dashboard"]}>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/dashboard"
                            element={<div>Protected Dashboard</div>}
                        />
                    </Route>

                    <Route
                        path="/login"
                        element={<div>Login Page</div>}
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Login Page")).toBeInTheDocument();
        expect(
            screen.queryByText("Protected Dashboard")
        ).not.toBeInTheDocument();
    });

    test("redirects to login when both token and user data are missing", () => {
        render(
            <MemoryRouter initialEntries={["/dashboard"]}>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/dashboard"
                            element={<div>Protected Dashboard</div>}
                        />
                    </Route>

                    <Route
                        path="/login"
                        element={<div>Login Page</div>}
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Login Page")).toBeInTheDocument();
    });

    test("renders protected content when token and user data exist", () => {
        localStorage.setItem("token", "test-token");
        localStorage.setItem(
            "user",
            JSON.stringify({
                id: "user-001",
                role: "ADMIN",
            })
        );

        render(
            <MemoryRouter initialEntries={["/dashboard"]}>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/dashboard"
                            element={<div>Protected Dashboard</div>}
                        />
                    </Route>

                    <Route
                        path="/login"
                        element={<div>Login Page</div>}
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(
            screen.getByText("Protected Dashboard")
        ).toBeInTheDocument();

        expect(
            screen.queryByText("Login Page")
        ).not.toBeInTheDocument();
    });
});
