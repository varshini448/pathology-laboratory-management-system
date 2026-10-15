const PRIORITY_RANK = {
  STAT: 0,
  URGENT: 1,
  NORMAL: 2,
};

const STATUS_RANK = {
  DELAYED: 0,
  IN_PROGRESS: 1,
  WITHIN_TAT: 2,
};

export const getCasePriorityRecommendations = (cases) => {
  if (!Array.isArray(cases)) return [];

  return cases
    .filter((item) => !item.isCompleted)
    .map((item) => {
      const priority = String(item.priority || "NORMAL").toUpperCase();
      const status = String(item.tatStatus || "").toUpperCase();
      const elapsed = Number(item.tatMinutes);
      const target = Number(item.targetMinutes);

      const reasons = [];

      if (priority === "STAT") {
        reasons.push("STAT priority requires prompt attention");
      } else if (priority === "URGENT") {
        reasons.push("Urgent-priority case");
      }

      if (status === "DELAYED") {
        reasons.push("Recorded turnaround time is delayed");
      }

      if (
        Number.isFinite(elapsed) &&
        Number.isFinite(target) &&
        target > 0 &&
        elapsed >= target * 0.8 &&
        status !== "DELAYED"
      ) {
        reasons.push("Approaching the configured turnaround target");
      }

      if (reasons.length === 0) {
        reasons.push("Routine monitoring");
      }

      const priorityRank = PRIORITY_RANK[priority] ?? 2;
      const statusRank = STATUS_RANK[status] ?? 1;
      const targetProgress =
        Number.isFinite(elapsed) && Number.isFinite(target) && target > 0
          ? elapsed / target
          : 0;

      return {
        ...item,
        assistantReasons: reasons,
        assistantRank: priorityRank * 100 + statusRank * 10 - targetProgress,
      };
    })
    .sort(
      (a, b) =>
        a.assistantRank - b.assistantRank ||
        String(a.caseId || "").localeCompare(String(b.caseId || ""))
    )
    .slice(0, 5);
};
