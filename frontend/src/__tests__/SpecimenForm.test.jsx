import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SpecimenForm from "../components/forms/SpecimenForm";

describe("SpecimenForm", () => {
    test("renders all specimen fields", () => {
        render(
            <SpecimenForm
                values={{}}
                onChange={vi.fn()}
                onSubmit={vi.fn()}
            />
        );

        expect(screen.getByText("Specimen Information")).toBeInTheDocument();
        expect(screen.getByLabelText("Specimen ID")).toBeInTheDocument();
        expect(screen.getByLabelText("Case ID")).toBeInTheDocument();
        expect(screen.getByLabelText("Specimen Type")).toBeInTheDocument();
        expect(screen.getByLabelText("Collection Date")).toBeInTheDocument();
        expect(screen.getByLabelText("Collection Site")).toBeInTheDocument();
        expect(screen.getByLabelText("Quality")).toBeInTheDocument();
        expect(screen.getByLabelText("Clinical Notes")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Save Specimen" })
        ).toBeInTheDocument();
    });

    test("displays provided specimen values", () => {
        const values = {
            specimenId: "SPEC001",
            caseId: "CASE001",
            specimenType: "Tissue",
            collectionDate: "2026-10-04T10:30",
            collectionSite: "Liver",
            quality: "GOOD",
            clinicalNotes: "Routine specimen",
        };

        render(
            <SpecimenForm
                values={values}
                onChange={vi.fn()}
                onSubmit={vi.fn()}
            />
        );

        expect(screen.getByLabelText("Specimen ID")).toHaveValue("SPEC001");
        expect(screen.getByLabelText("Case ID")).toHaveValue("CASE001");
        expect(screen.getByLabelText("Specimen Type")).toHaveValue("Tissue");
        expect(screen.getByLabelText("Collection Date")).toHaveValue(
            "2026-10-04T10:30"
        );
        expect(screen.getByLabelText("Collection Site")).toHaveValue("Liver");
        expect(screen.getByLabelText("Quality")).toHaveValue("GOOD");
        expect(screen.getByLabelText("Clinical Notes")).toHaveValue(
            "Routine specimen"
        );
    });

    test("calls onChange with updated field value", () => {
        const onChange = vi.fn();

        render(
            <SpecimenForm
                values={{
                    specimenId: "SPEC001",
                    caseId: "CASE001",
                    specimenType: "Tissue",
                }}
                onChange={onChange}
                onSubmit={vi.fn()}
            />
        );

        fireEvent.change(screen.getByLabelText("Specimen Type"), {
            target: {
                name: "specimenType",
                value: "Blood",
            },
        });

        expect(onChange).toHaveBeenCalledWith({
            specimenId: "SPEC001",
            caseId: "CASE001",
            specimenType: "Blood",
        });
    });

    test("calls onSubmit when required fields are valid", () => {
        const onSubmit = vi.fn((event) => event.preventDefault());

        render(
            <SpecimenForm
                values={{
                    specimenId: "SPEC001",
                    caseId: "CASE001",
                    specimenType: "Tissue",
                }}
                onChange={vi.fn()}
                onSubmit={onSubmit}
            />
        );

        fireEvent.submit(screen.getByRole("button", { name: "Save Specimen" }).closest("form"));

        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    test("marks required fields as required", () => {
    render(
        <SpecimenForm
            values={{}}
            onChange={vi.fn()}
            onSubmit={vi.fn()}
        />
    );

    expect(screen.getByLabelText("Specimen ID")).toBeRequired();
    expect(screen.getByLabelText("Case ID")).toBeRequired();
    expect(screen.getByLabelText("Specimen Type")).toBeRequired();
});

    test("shows loading state and disables submit button", () => {
        render(
            <SpecimenForm
                values={{
                    specimenId: "SPEC001",
                    caseId: "CASE001",
                    specimenType: "Tissue",
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

    test("shows Save Specimen when not loading", () => {
        render(
            <SpecimenForm
                values={{
                    specimenId: "SPEC001",
                    caseId: "CASE001",
                    specimenType: "Tissue",
                }}
                onChange={vi.fn()}
                onSubmit={vi.fn()}
                loading={false}
            />
        );

        const button = screen.getByRole("button", { name: "Save Specimen" });

        expect(button).not.toBeDisabled();
    });
});