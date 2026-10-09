export const getPriorityClass = (priority) => {
  switch (priority?.toUpperCase()) {
    case "STAT":
      return "case-priority case-priority-stat";
    case "URGENT":
      return "case-priority case-priority-urgent";
    default:
      return "case-priority case-priority-normal";
  }
};

export const getStatusClass = (status) => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return "case-status case-status-completed";
    case "REPORTED":
      return "case-status case-status-reported";
    case "IN_PROCESS":
      return "case-status case-status-process";
    case "SPECIMEN_COLLECTED":
      return "case-status case-status-process";
    default:
      return "case-status case-status-default";
  }
};
