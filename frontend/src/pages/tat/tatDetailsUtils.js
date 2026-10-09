export const formatDuration = (minutes) => {
  if (minutes === null || minutes === undefined) {
    return "N/A";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  return `${hours} hr ${remainingMinutes} min`;
};

export const formatDateTime = (date) => {
  if (!date) {
    return "N/A";
  }

  return new Date(date).toLocaleString();
};

export const formatStageName = (stage) => {
  return stage
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export const getPriorityClass = (priority) => {
  if (priority === "STAT") {
    return "tat-badge tat-badge-stat";
  }

  if (priority === "URGENT") {
    return "tat-badge tat-badge-urgent";
  }

  return "tat-badge tat-badge-normal";
};

export const getTATStatusClass = (status) => {
  if (status === "DELAYED") {
    return "tat-status tat-status-delayed";
  }

  if (status === "WITHIN_TAT") {
    return "tat-status tat-status-within";
  }

  return "tat-status tat-status-progress";
};

export const getTATStatusLabel = (status) => {
  if (status === "DELAYED") {
    return "Delayed";
  }

  if (status === "WITHIN_TAT") {
    return "Within TAT";
  }

  return "In Progress";
};
