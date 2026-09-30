import React from "react";

const STATUS_LABELS = {
  APPROVED: "Approved",
  PENDING: "Pending",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
  WITHDRAWN: "Withdrawn",
};

const ConsentStatusBadge = ({ status = "PENDING" }) => {
  const normalizedStatus = status.toUpperCase();

  return (
    <span
      className={`consent-status-badge consent-status-badge-${normalizedStatus.toLowerCase()}`}
    >
      {STATUS_LABELS[normalizedStatus] || normalizedStatus}
    </span>
  );
};

export default ConsentStatusBadge;