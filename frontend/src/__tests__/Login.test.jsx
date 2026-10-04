import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Login from "../pages/auth/Login";
import {
    loginUser,
    loginPatient,
    loginDoctor,
} from "../services/authService";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("../services/authService", () => ({
    loginUser: vi.fn(),
    loginPatient: vi.fn(),
    loginDoctor: vi.fn(),
}));

describe("Login", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders the login page", () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(
            screen.getByText("Sign in to your account")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Sign In" })
        ).toBeInTheDocument();

        expect(
            screen.getByText("Internal Staff")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Patient / Doctor")
        ).toBeInTheDocument();
    });

    test("does not call login service when identifier is empty", () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const form = screen
            .getByRole("button", { name: "Sign In" })
            .closest("form");

        fireEvent.submit(form);

        expect(loginUser).not.toHaveBeenCalled();
    });

    test("does not call login service when password is empty", () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const identifierInput = screen.getByLabelText(
            /email|employee|medical|identifier/i
        );

        fireEvent.change(identifierInput, {
            target: {
                name: "identifier",
                value: "admin@test.com",
            },
        });

        const form = screen
            .getByRole("button", { name: "Sign In" })
            .closest("form");

        fireEvent.submit(form);

        expect(loginUser).not.toHaveBeenCalled();
    });

    test("logs in an ADMIN user and navigates to admin dashboard", async () => {
        loginUser.mockResolvedValue({
            user: {
                role: "ADMIN",
            },
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const identifierInput = screen.getByLabelText(
            /email|employee|medical|identifier/i
        );

        const passwordInput = screen.getByLabelText(/password/i);

        fireEvent.change(identifierInput, {
            target: {
                name: "identifier",
                value: "admin@test.com",
            },
        });

        fireEvent.change(passwordInput, {
            target: {
                name: "password",
                value: "Admin@123",
            },
        });

        fireEvent.click(
            screen.getByRole("button", { name: "Sign In" })
        );

        await waitFor(() => {
            expect(loginUser).toHaveBeenCalledWith({
                identifier: "admin@test.com",
                password: "Admin@123",
                accountType: "internal",
                rememberMe: false,
            });

            expect(mockNavigate).toHaveBeenCalledWith(
                "/admin-dashboard"
            );
        });
    });

    test("switches to external patient login", () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Patient / Doctor",
            })
        );

        expect(
            screen.getByRole("button", { name: "Patient" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Doctor" })
        ).toBeInTheDocument();
    });

    test("logs in a patient and navigates to patient page", async () => {
        loginPatient.mockResolvedValue({
            user: {
                userType: "PATIENT",
            },
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Patient / Doctor",
            })
        );

        const identifierInput = screen.getByLabelText(
            /email|mobile|patient|doctor|identifier/i
        );

        const passwordInput = screen.getByLabelText(/password/i);

        fireEvent.change(identifierInput, {
            target: {
                name: "identifier",
                value: "PAT-00001",
            },
        });

        fireEvent.change(passwordInput, {
            target: {
                name: "password",
                value: "Patient@123",
            },
        });

        fireEvent.click(
            screen.getByRole("button", { name: "Sign In" })
        );

        await waitFor(() => {
            expect(loginPatient).toHaveBeenCalledWith({
                identifier: "PAT-00001",
                password: "Patient@123",
            });

            expect(mockNavigate).toHaveBeenCalledWith("/patient");
        });
    });

    test("displays authentication error when login fails", async () => {
        loginUser.mockRejectedValue(
            new Error("Invalid credentials")
        );

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const identifierInput = screen.getByLabelText(
            /email|employee|medical|identifier/i
        );

        const passwordInput = screen.getByLabelText(/password/i);

        fireEvent.change(identifierInput, {
            target: {
                name: "identifier",
                value: "wrong@test.com",
            },
        });

        fireEvent.change(passwordInput, {
            target: {
                name: "password",
                value: "wrong-password",
            },
        });

        fireEvent.click(
            screen.getByRole("button", { name: "Sign In" })
        );

        expect(
            await screen.findByText("Invalid credentials")
        ).toBeInTheDocument();
    });
});
