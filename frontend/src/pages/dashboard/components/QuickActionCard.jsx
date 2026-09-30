import React from "react";

const QuickActionCard = ({
  title,
  description,
  icon = "→",
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      className="quick-action-card"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="quick-action-icon" aria-hidden="true">
        {icon}
      </span>

      <span className="quick-action-content">
        <strong>{title}</strong>
        {description && <small>{description}</small>}
      </span>

      <span className="quick-action-arrow" aria-hidden="true">
        →
      </span>
    </button>
  );
};

export default QuickActionCard;
