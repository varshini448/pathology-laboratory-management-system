import React from "react";

const Loading = ({
  message = "Loading...",
  fullScreen = false,
}) => {
  return (
    <div
      className={`loading-container ${
        fullScreen ? "loading-fullscreen" : ""
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="loading-spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
};

export default Loading;