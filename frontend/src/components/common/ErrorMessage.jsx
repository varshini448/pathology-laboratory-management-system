import React from "react";

const ErrorMessage = ({
  message = "Something went wrong. Please try again.",
  onRetry,
}) => {
  return (
    <div className="error-message" role="alert">
      <div>
        <h3>Unable to complete the request</h3>
        <p>{message}</p>
      </div>

      {onRetry && (
        <button type="button" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;