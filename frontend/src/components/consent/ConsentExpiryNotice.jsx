import React from "react";

const ConsentExpiryNotice = ({
  expiryDate,
  daysRemaining,
  onRenew,
}) => {
  const isExpired = daysRemaining !== undefined && daysRemaining <= 0;
  const isExpiringSoon =
    daysRemaining !== undefined &&
    daysRemaining > 0 &&
    daysRemaining <= 7;

  if (!expiryDate) {
    return null;
  }

  return (
    <div
      className={`consent-expiry-notice ${
        isExpired
          ? "consent-expired"
          : isExpiringSoon
            ? "consent-expiring-soon"
            : ""
      }`}
      role={isExpired || isExpiringSoon ? "alert" : "status"}
    >
      <div>
        <strong>
          {isExpired
            ? "Consent Expired"
            : isExpiringSoon
              ? "Consent Expiring Soon"
              : "Consent Valid"}
        </strong>

        <p>
          {isExpired
            ? `Consent expired on ${expiryDate}.`
            : `Consent expires on ${expiryDate}.`}
        </p>

        {isExpiringSoon && daysRemaining !== undefined && (
          <span>{daysRemaining} day(s) remaining</span>
        )}
      </div>

      {(isExpired || isExpiringSoon) && onRenew && (
        <button type="button" onClick={onRenew}>
          Renew Consent
        </button>
      )}
    </div>
  );
};

export default ConsentExpiryNotice;