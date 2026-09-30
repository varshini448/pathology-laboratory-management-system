import React from "react";

const ConsentCard = ({
  title = "Patient Consent",
  description = "Consent is required before processing patient information.",
  status = "PENDING",
  date,
  onAction,
  actionLabel = "Review Consent",
}) => {
  return (
    <article className="consent-card">
      <div className="consent-card-content">
        <div>
          <p className="consent-card-label">CONSENT</p>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>

        <span className={`consent-status consent-status-${status.toLowerCase()}`}>
          {status.replace("_", " ")}
        </span>
      </div>

      {date && (
        <div className="consent-card-date">
          <span>Recorded:</span>
          <strong>{date}</strong>
        </div>
      )}

      {onAction && (
        <button type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </article>
  );
};

export default ConsentCard;