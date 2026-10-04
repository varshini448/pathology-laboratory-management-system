import { render, screen } from "@testing-library/react";
import WorkflowStepper from "../components/workflow/WorkflowStepper";

describe("WorkflowStepper", () => {
    test("renders all workflow stages", () => {
        render(<WorkflowStepper workflowEvents={[]} />);

        expect(screen.getByText("Workflow Progress")).toBeInTheDocument();
        expect(screen.getByText("8 stages")).toBeInTheDocument();

        expect(screen.getByText("Specimen Collection")).toBeInTheDocument();
        expect(screen.getByText("Accessioning")).toBeInTheDocument();
        expect(screen.getByText("Grossing")).toBeInTheDocument();
        expect(screen.getByText("Embedding")).toBeInTheDocument();
        expect(screen.getByText("Sectioning")).toBeInTheDocument();
        expect(screen.getByText("Staining")).toBeInTheDocument();
        expect(screen.getByText("Scanning")).toBeInTheDocument();
        expect(screen.getByText("Pathologist Review")).toBeInTheDocument();
    });

    test("shows all stages as pending when there are no workflow events", () => {
        render(<WorkflowStepper workflowEvents={[]} />);

        expect(screen.getAllByText("Pending")).toHaveLength(8);
    });

    test("marks a completed stage correctly", () => {
        const workflowEvents = [
            {
                stage: "SPECIMEN_COLLECTION",
                status: "COMPLETED",
                createdAt: "2026-10-04T09:00:00.000Z",
            },
        ];

        render(<WorkflowStepper workflowEvents={workflowEvents} />);

        const stage = screen
            .getByText("Specimen Collection")
            .closest(".workflow-step");

        expect(stage).toHaveClass("workflow-step--completed");
        expect(stage).toHaveTextContent("Completed");
    });

    test("marks the latest started stage as in progress", () => {
        const workflowEvents = [
            {
                stage: "SPECIMEN_COLLECTION",
                status: "COMPLETED",
                createdAt: "2026-10-04T09:00:00.000Z",
            },
            {
                stage: "ACCESSIONING",
                status: "STARTED",
                createdAt: "2026-10-04T10:00:00.000Z",
            },
        ];

        render(<WorkflowStepper workflowEvents={workflowEvents} />);

        const stage = screen
            .getByText("Accessioning")
            .closest(".workflow-step");

        expect(stage).toHaveClass("workflow-step--current");
        expect(stage).toHaveTextContent("In progress");
    });

    test("uses the latest event when a stage has multiple events", () => {
        const workflowEvents = [
            {
                stage: "SPECIMEN_COLLECTION",
                status: "STARTED",
                createdAt: "2026-10-04T08:00:00.000Z",
            },
            {
                stage: "SPECIMEN_COLLECTION",
                status: "COMPLETED",
                createdAt: "2026-10-04T09:00:00.000Z",
            },
        ];

        render(<WorkflowStepper workflowEvents={workflowEvents} />);

        const stage = screen
            .getByText("Specimen Collection")
            .closest(".workflow-step");

        expect(stage).toHaveClass("workflow-step--completed");
        expect(stage).toHaveTextContent("Completed");
    });

    test("keeps an unprocessed stage pending", () => {
        const workflowEvents = [
            {
                stage: "SPECIMEN_COLLECTION",
                status: "COMPLETED",
                createdAt: "2026-10-04T09:00:00.000Z",
            },
        ];

        render(<WorkflowStepper workflowEvents={workflowEvents} />);

        const stage = screen
            .getByText("Grossing")
            .closest(".workflow-step");

        expect(stage).toHaveClass("workflow-step--pending");
        expect(stage).toHaveTextContent("Pending");
    });
});
