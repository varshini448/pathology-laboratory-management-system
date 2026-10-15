import { describe, expect, it } from "vitest";
import { getCasePriorityRecommendations } from "../pages/tat/tatPriorityAssistant";

describe("getCasePriorityRecommendations", () => {
  it("ranks STAT cases ahead of URGENT and NORMAL cases", () => {
    const cases = [
      {
        caseId: "CASE-NORMAL",
        priority: "NORMAL",
        tatStatus: "IN_PROGRESS",
        tatMinutes: 30,
        targetMinutes: 180,
        isCompleted: false,
      },
      {
        caseId: "CASE-URGENT",
        priority: "URGENT",
        tatStatus: "IN_PROGRESS",
        tatMinutes: 30,
        targetMinutes: 120,
        isCompleted: false,
      },
      {
        caseId: "CASE-STAT",
        priority: "STAT",
        tatStatus: "IN_PROGRESS",
        tatMinutes: 20,
        targetMinutes: 60,
        isCompleted: false,
      },
    ];

    const result = getCasePriorityRecommendations(cases);

    expect(result.map((item) => item.caseId)).toEqual([
      "CASE-STAT",
      "CASE-URGENT",
      "CASE-NORMAL",
    ]);
    expect(result[0].assistantReasons).toContain(
      "STAT priority requires prompt attention"
    );
  });

  it("flags delayed and near-target cases", () => {
    const result = getCasePriorityRecommendations([
      {
        caseId: "CASE-DELAYED",
        priority: "URGENT",
        tatStatus: "DELAYED",
        tatMinutes: 150,
        targetMinutes: 120,
        isCompleted: false,
      },
      {
        caseId: "CASE-NEAR",
        priority: "NORMAL",
        tatStatus: "IN_PROGRESS",
        tatMinutes: 90,
        targetMinutes: 100,
        isCompleted: false,
      },
    ]);

    expect(result[0].assistantReasons).toContain(
      "Recorded turnaround time is delayed"
    );
    expect(result[1].assistantReasons).toContain(
      "Approaching the configured turnaround target"
    );
  });

  it("excludes completed cases and returns at most five recommendations", () => {
    const cases = Array.from({ length: 7 }, (_, index) => ({
      caseId: `CASE-${index}`,
      priority: "NORMAL",
      tatStatus: "IN_PROGRESS",
      tatMinutes: 10,
      targetMinutes: 100,
      isCompleted: false,
    }));

    cases.push({
      caseId: "CASE-COMPLETED",
      priority: "STAT",
      tatStatus: "WITHIN_TAT",
      tatMinutes: 10,
      targetMinutes: 100,
      isCompleted: true,
    });

    const result = getCasePriorityRecommendations(cases);

    expect(result).toHaveLength(5);
    expect(result.some((item) => item.caseId === "CASE-COMPLETED")).toBe(false);
  });

  it("returns an empty list for invalid or empty input", () => {
    expect(getCasePriorityRecommendations(null)).toEqual([]);
    expect(getCasePriorityRecommendations([])).toEqual([]);
  });
});
