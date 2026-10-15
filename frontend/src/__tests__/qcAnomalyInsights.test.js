import { describe, expect, it } from "vitest";
import {
  analyzeQCRecord,
  getQCAnomalyInsights,
} from "../pages/qc/qcAnomalyInsights";

const passingRecord = {
  qcId: "QC001",
  sectionQuality: "GOOD",
  stainingQuality: "GOOD",
  labelingCheck: "PASS",
  documentationCheck: "PASS",
  overallStatus: "PASSED",
};

describe("analyzeQCRecord", () => {
  it("returns no flags for a consistent passing record", () => {
    expect(analyzeQCRecord(passingRecord)).toEqual([]);
  });

  it("flags poor section quality", () => {
    const flags = analyzeQCRecord({
      ...passingRecord,
      sectionQuality: "POOR",
    });

    expect(flags.map((flag) => flag.code)).toContain("POOR_SECTION_QUALITY");
  });

  it("flags poor staining quality", () => {
    const flags = analyzeQCRecord({
      ...passingRecord,
      stainingQuality: "POOR",
    });

    expect(flags.map((flag) => flag.code)).toContain("POOR_STAINING_QUALITY");
  });

  it("flags failed labeling and documentation checks", () => {
    const flags = analyzeQCRecord({
      ...passingRecord,
      labelingCheck: "FAIL",
      documentationCheck: "FAIL",
      overallStatus: "FAILED",
    });

    expect(flags.map((flag) => flag.code)).toContain("LABELING_FAILURE");
    expect(flags.map((flag) => flag.code)).toContain("DOCUMENTATION_FAILURE");
  });

  it("flags a passed status when a check fails", () => {
    const flags = analyzeQCRecord({
      ...passingRecord,
      labelingCheck: "FAIL",
    });

    expect(flags.map((flag) => flag.code)).toContain("STATUS_REVIEW_MISMATCH");
  });

  it("does not flag a status mismatch for a failed overall result", () => {
    const flags = analyzeQCRecord({
      ...passingRecord,
      stainingQuality: "POOR",
      overallStatus: "FAILED",
    });

    expect(flags.map((flag) => flag.code)).not.toContain("STATUS_REVIEW_MISMATCH");
  });
});

describe("getQCAnomalyInsights", () => {
  it("counts records analyzed and flagged", () => {
    const result = getQCAnomalyInsights([
      passingRecord,
      { ...passingRecord, qcId: "QC002", stainingQuality: "POOR" },
    ]);

    expect(result.recordsAnalyzed).toBe(2);
    expect(result.flaggedRecordCount).toBe(1);
  });

  it("reports repeated issues only when at least two records have them", () => {
    const single = getQCAnomalyInsights([
      { ...passingRecord, stainingQuality: "POOR" },
    ]);

    const repeated = getQCAnomalyInsights([
      { ...passingRecord, qcId: "QC002", stainingQuality: "POOR" },
      { ...passingRecord, qcId: "QC003", stainingQuality: "POOR" },
    ]);

    expect(single.patterns).toEqual([]);
    expect(repeated.patterns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "POOR_STAINING_QUALITY",
          count: 2,
        }),
      ]),
    );
  });

  it("handles empty and invalid collection inputs safely", () => {
    expect(getQCAnomalyInsights([]).recordsAnalyzed).toBe(0);
    expect(getQCAnomalyInsights(null).flaggedRecordCount).toBe(0);
  });
});
