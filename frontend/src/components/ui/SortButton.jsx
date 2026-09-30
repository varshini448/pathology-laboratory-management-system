import React from "react";

const SortButton = ({
  label,
  direction,
  onClick,
}) => {
  const icon =
    direction === "asc"
      ? "↑"
      : direction === "desc"
        ? "↓"
        : "↕";

  return (
    <button
      type="button"
      className="ui-sort-button"
      onClick={onClick}
      aria-label={`Sort by ${label}`}
    >
      <span>{label}</span>
      <span aria-hidden="true">{icon}</span>
    </button>
  );
};

export default SortButton;