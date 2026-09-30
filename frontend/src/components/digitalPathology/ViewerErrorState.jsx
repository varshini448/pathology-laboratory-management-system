import React from "react";

const ViewerErrorState = ({
  message = "The digital slide could not be loaded.",
  onRetry,
}) => {
  return (
    <div className="viewer-error-state" role="alert">
      <div className="viewer-error-icon" aria-hidden="true">
        !
      </div>

      <h3>Viewer Unavailable</h3>

      <p>{message}</p>

      {onRetry && (
        <button type="button" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ViewerErrorState;