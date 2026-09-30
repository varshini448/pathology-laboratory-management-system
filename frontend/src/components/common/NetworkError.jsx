import React from "react";

const NetworkError = ({ onRetry }) => {
  return (
    <div className="network-error" role="alert">
      <div className="network-error-icon" aria-hidden="true">
        !
      </div>

      <div>
        <h3>Connection Problem</h3>
        <p>
          We could not connect to the server. Please check your connection and
          try again.
        </p>

        {onRetry && (
          <button type="button" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default NetworkError;