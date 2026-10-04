import { describe, expect, test, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import CaseDetails from "../pages/cases/CaseDetails";
import useCaseDetails from "../hooks/useCaseDetails";

vi.mock("../hooks/useCaseDetails", () => ({
    default: vi.fn(),
}));

vi.mock("../components/cases/CaseInformation", () => ({
    default: ({ caseData }) => (
        <div data-testid="case-information">
            Case Information: {caseData.caseId}
        </div>
    ),
}));

vi.mock("../components/cases/CaseProcessingSummary", () => ({
    default: ({ specimens, blocks, slides, workflowEvents }) => (
        <div data-testid="case-processing-summary">
            Specimens: {specimens.length} | Blocks: {blocks.length} |
            Slides: {slides.length} | Workflow: {workflowEvents.length}
        </div>
    ),
}));

vi.mock("../components/cases/CaseWorkflow", () => ({
    default: ({
        caseId,
        specimenId,
        blockId,
        slideId,
        workflowEvents,
        onWorkflowUpdated,
    }) => (
        <div data-testid="case-workflow">
            <span>Case: {caseId}</span>
            <span>Specimen: {specimenId}</span>
            <span>Block: {blockId}</span>
            <span>Slide: {slideId}</span>
            <span>Workflow Events: {workflowEvents.length}</span>

            <button type="button" onClick={onWorkflowUpdated}>
                Refresh Workflow
            </button>
        </div>
    ),
}));

const renderCaseDetails = () =>
    render(
        <MemoryRouter initialEntries={["/cases/CASE001"]}>
            <Routes>
                <Route path="/cases/:id" element={<CaseDetails />} />
            </Routes>
        </MemoryRouter>
    );

const defaultCaseData = {
    _id: "mongo-case-id",
    caseId: "CASE001",
    caseType: "Biopsy",
    priority: "URGENT",
    status: "IN_PROCESS",
    patient: {
        name: "Rahul Kumar",
    },
    doctor: {
        name: "Dr. Priya Sharma",
    },
};

const defaultHookData = {
    caseData: defaultCaseData,
    workflowEvents: [
        {
            stage: "SPECIMEN_COLLECTION",
            status: "COMPLETED",
        },
    ],
    specimens: [
        {
            _id: "specimen-id",
        },
    ],
    blocks: [
        {
            _id: "block-id",
        },
    ],
    slides: [
        {
            _id: "slide-id",
        },
    ],
    loading: false,
    workflowLoading: false,
    error: null,
    loadWorkflow: vi.fn(),
};

describe("CaseDetails", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useCaseDetails.mockReturnValue({
            ...defaultHookData,
            loadWorkflow: vi.fn(),
        });
    });

    test("shows loading state while case details are loading", () => {
        useCaseDetails.mockReturnValue({
            ...defaultHookData,
            caseData: null,
            loading: true,
            error: null,
        });

        renderCaseDetails();

        expect(
            screen.getByText("Loading case details...")
        ).toBeInTheDocument();
    });

    test("shows error state when case loading fails", () => {
        useCaseDetails.mockReturnValue({
            ...defaultHookData,
            caseData: null,
            loading: false,
            error: "Unable to connect to server.",
        });

        renderCaseDetails();

        expect(screen.getByText("Unable to load case")).toBeInTheDocument();
        expect(
            screen.getByText("Unable to connect to server.")
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Retry/i })
        ).toBeInTheDocument();
    });

    test("shows case not found state when no case data exists", () => {
        useCaseDetails.mockReturnValue({
            ...defaultHookData,
            caseData: null,
            loading: false,
            error: null,
        });

        renderCaseDetails();

        expect(screen.getByText("Case not found")).toBeInTheDocument();
        expect(
            screen.getByText(
                "The requested case record could not be found."
            )
        ).toBeInTheDocument();

        const backLink = screen.getByRole("link", {
            name: /Back to Cases/i,
        });

        expect(backLink).toHaveAttribute("href", "/cases");
    });

    test("renders case information successfully", () => {
        renderCaseDetails();

        expect(screen.getByRole("heading", { name: "Case CASE001" }))
            .toBeInTheDocument();

        expect(screen.getByText("Biopsy")).toBeInTheDocument();
        expect(screen.getByText("Rahul Kumar")).toBeInTheDocument();
        expect(screen.getByText("Dr. Priya Sharma")).toBeInTheDocument();

        expect(screen.getByText("URGENT")).toBeInTheDocument();
        expect(screen.getByText("IN PROCESS")).toBeInTheDocument();
    });

    test("provides a TAT link for the current case", () => {
        renderCaseDetails();

        const tatLink = screen.getByRole("link", {
            name: /View TAT/i,
        });

        expect(tatLink).toHaveAttribute("href", "/tat/CASE001");
    });

    test("passes case data and processing data to child components", () => {
        renderCaseDetails();

        expect(
            screen.getByTestId("case-information")
        ).toHaveTextContent("Case Information: CASE001");

        expect(
            screen.getByTestId("case-processing-summary")
        ).toHaveTextContent(
            "Specimens: 1 | Blocks: 1 | Slides: 1 | Workflow: 1"
        );
    });

    test("passes workflow identifiers and refresh callback to CaseWorkflow", () => {
        const loadWorkflow = vi.fn();

        useCaseDetails.mockReturnValue({
            ...defaultHookData,
            loadWorkflow,
        });

        renderCaseDetails();

        const workflow = screen.getByTestId("case-workflow");

        expect(workflow).toHaveTextContent("Case: mongo-case-id");
        expect(workflow).toHaveTextContent("Specimen: specimen-id");
        expect(workflow).toHaveTextContent("Block: block-id");
        expect(workflow).toHaveTextContent("Slide: slide-id");
        expect(workflow).toHaveTextContent("Workflow Events: 1");

        fireEvent.click(
            screen.getByRole("button", { name: "Refresh Workflow" })
        );

        expect(loadWorkflow).toHaveBeenCalledTimes(1);
    });
});