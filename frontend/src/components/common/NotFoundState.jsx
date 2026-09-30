import React from "react";

const NotFoundState = ({
  title = "No Data Found",
  message = "There is no information available to display.",
  action,
}) => {
  return (
    <div className="not-found-state">
      <div className="not-found-icon" aria-hidden="true">
        404
      </div>

      <h2>{title}</h2>
      <p>{message}</p>

      {action && <div className="not-found-action">{action}</div>}
    </div>
  );
};

export default NotFoundState;