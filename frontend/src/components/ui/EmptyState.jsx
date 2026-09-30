import React from "react";

const EmptyState = ({
  title = "No data found",
  message = "There is no information to display.",
  action,
}) => {
  return (
    <div className="ui-empty-state">
      <div className="ui-empty-icon" aria-hidden="true">
        ∅
      </div>

      <h3>{title}</h3>
      <p>{message}</p>

      {action && (
        <div className="ui-empty-action">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;