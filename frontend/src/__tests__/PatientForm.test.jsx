import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import PatientForm from "../components/forms/PatientForm";

const fillRequiredFields = () => {
  fireEvent.change(screen.getByLabelText("Patient ID"), {
    target: { value: "PAT-100" },
  });
  fireEvent.change(screen.getByLabelText("Full Name"), {
    target: { value: "Sam Patient" },
  });
  fireEvent.change(screen.getByLabelText("Age"), {
    target: { value: "42" },
  });
  fireEvent.change(screen.getByLabelText("Gender"), {
    target: { value: "OTHER" },
  });
  fireEvent.change(screen.getByLabelText("Phone Number"), {
    target: { value: "9876543210" },
  });
};

describe("PatientForm", () => {
  test("preserves entered values when the save fails", async () => {
    const onSubmit = vi.fn().mockResolvedValue(false);
    const { container } = render(<PatientForm onSubmit={onSubmit} />);
    fillRequiredFields();

    fireEvent.submit(container.querySelector("form"));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(screen.getByLabelText("Patient ID")).toHaveValue("PAT-100");
  });

  test("clears entered values after a successful save", async () => {
    const onSubmit = vi.fn().mockResolvedValue(true);
    const { container } = render(<PatientForm onSubmit={onSubmit} />);
    fillRequiredFields();

    fireEvent.submit(container.querySelector("form"));

    await waitFor(() => expect(screen.getByLabelText("Patient ID")).toHaveValue(""));
  });
});
