import { describe, expect, test } from "vitest";
import { getWorkflowBottleneckRecommendation } from "../pages/workflow/workflowBottleneckRecommendations";

describe("workflow bottleneck recommendations", () => {
  const stages = [
    "SPECIMEN_COLLECTION",
    "ACCESSIONING",
    "GROSSING",
    "EMBEDDING",
    "SECTIONING",
    "STAINING",
    "SCANNING",
    "PATHOLOGIST_REVIEW",
  ];

  test.each(stages)("provides an operational recommendation for %s", (stage) => {
    const result = getWorkflowBottleneckRecommendation(stage);

    expect(result.action).toBeTruthy();
    expect(result.rationale).toBeTruthy();
  });

  test("provides a safe fallback for an unknown stage", () => {
    const result = getWorkflowBottleneckRecommendation("UNKNOWN_STAGE");

    expect(result.action).toMatch(/review the current stage/i);
    expect(result.rationale).toMatch(/confirm the operational status/i);
  });

  test("handles a missing stage using the fallback", () => {
    expect(getWorkflowBottleneckRecommendation(undefined).action)
      .toMatch(/review the current stage/i);
  });
});
