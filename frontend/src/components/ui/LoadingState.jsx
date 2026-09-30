import React from "react";

const LoadingState = ({
  message = "Loading...",
  fullPage = false,
}) => {
  return (
    <div
      className={`ui-loading-state ${
        fullPage ? "ui-loading-full-page" : ""
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="ui-loading-spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
};

export default LoadingState;