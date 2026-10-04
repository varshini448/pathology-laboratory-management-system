import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ReportForm from "../components/forms/ReportForm";

describe("ReportForm", () => {
    test("renders all report fields", () => {
        render(
            <ReportForm
                values={{}}
                onChange={vi.fn()}
                onSubmit={vi.fn()}
            />
        );

        expect(screen.getByText("Pathology Report")).toBeInTheDocument();
        expect(screen.getByLabelText("Report ID")).toBeInTheDocument();
        expect(screen.getByLabelText("Case ID")).toBeInTheDocument();
        expect(screen.getByLabelText("Diagnosis")).toBeInTheDocument();
        expect(screen.getByLabelText("Microscopic Findings")).toBeInTheDocument();
        expect(screen.getByLabelText("Gross Findings")).toBeInTheDocument();
        expect(screen.getByLabelText("Interpretation")).toBeInTheDocument();
        expect(screen.getByLabelText("Recommendations")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Save Report" })
        ).toBeInTheDocument();
    });

    test("displays provided report values", () => {
        const values = {
            reportId: "REP-001",
            caseId: "CASE001",
            diagnosis: "Benign tissue",
            microscopicFindings: "No malignant cells identified.",
            grossFindings: "Tissue fragments received.",
            interpretation: "Findings are consistent with benign pathology.",
            recommendations: "Routine follow-up recommended.",
        };

        render(
            <ReportForm
                values={values}
                onChange={vi.fn()}
                onSubmit={vi.fn()}
            />
        );

        expect(screen.getByLabelText("Report ID")).toHaveValue("REP-001");
        expect(screen.getByLabelText("Case ID")).toHaveValue("CASE001");
        expect(screen.getByLabelText("Diagnosis")).toHaveValue(
            "Benign tissue"
        );
        expect(screen.getByLabelText("Microscopic Findings")).toHaveValue(
            "No malignant cells identified."
        );
        expect(screen.getByLabelText("Gross Findings")).toHaveValue(
            "Tissue fragments received."
        );
        expect(screen.getByLabelText("Interpretation")).toHaveValue(
            "Findings are consistent with benign pathology."
        );
        expect(screen.getByLabelText("Recommendations")).toHaveValue(
            "Routine follow-up recommended."
        );
    });

    test("calls onChange with updated diagnosis", () => {
        const onChange = vi.fn();

        render(
            <ReportForm
                values={{
                    reportId: "REP-001",
                    caseId: "CASE001",
                    diagnosis: "Initial diagnosis",
                }}
                onChange={onChange}
                onSubmit={vi.fn()}
            />
        );

        fireEvent.change(screen.getByLabelText("Diagnosis"), {
            target: {
                name: "diagnosis",
                value: "Updated diagnosis",
            },
        });

        expect(onChange).toHaveBeenCalledWith({
            reportId: "REP-001",
            caseId: "CASE001",
            diagnosis: "Updated diagnosis",
        });
    });

    test("calls onSubmit when diagnosis is provided", () => {
        const onSubmit = vi.fn((event) => event.preventDefault());

        render(
            <ReportForm
                values={{
                    reportId: "REP-001",
                    caseId: "CASE001",
                    diagnosis: "Benign tissue",
                }}
                onChange={vi.fn()}
                onSubmit={onSubmit}
            />
        );

        const form = screen
            .getByRole("button", { name: "Save Report" })
            .closest("form");

        fireEvent.submit(form);

        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    test("marks diagnosis as required", () => {
        render(
            <ReportForm
                values={{}}
                onChange={vi.fn()}
                onSubmit={vi.fn()}
            />
        );

        expect(screen.getByLabelText("Diagnosis")).toBeRequired();
    });

    test("shows loading state and disables submit button", () => {
        render(
            <ReportForm
                values={{
                    diagnosis: "Benign tissue",
                }}
                onChange={vi.fn()}
                onSubmit={vi.fn()}
                loading={true}
            />
        );

        const button = screen.getByRole("button", { name: "Saving..." });

        expect(button).toBeDisabled();
        expect(button).toHaveTextContent("Saving...");
    });

    test("read-only mode hides save button and prevents editing", () => {
        render(
            <ReportForm
                values={{
                    reportId: "REP-001",
                    caseId: "CASE001",
                    diagnosis: "Benign tissue",
                }}
                onChange={vi.fn()}
                onSubmit={vi.fn()}
                readOnly={true}
            />
        );

        expect(
            screen.queryByRole("button", { name: "Save Report" })
        ).not.toBeInTheDocument();

        expect(screen.getByLabelText("Report ID")).toHaveAttribute(
            "readonly"
        );
        expect(screen.getByLabelText("Case ID")).toHaveAttribute(
            "readonly"
        );
        expect(screen.getByLabelText("Diagnosis")).toHaveAttribute(
            "readonly"
        );
        expect(screen.getByLabelText("Microscopic Findings")).toHaveAttribute(
            "readonly"
        );
        expect(screen.getByLabelText("Gross Findings")).toHaveAttribute(
            "readonly"
        );
        expect(screen.getByLabelText("Interpretation")).toHaveAttribute(
            "readonly"
        );
        expect(screen.getByLabelText("Recommendations")).toHaveAttribute(
            "readonly"
        );
    });
});