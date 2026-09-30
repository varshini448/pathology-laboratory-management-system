import React from "react";

const SessionExpiredMessage = ({ onLogin }) => {
  const handleLogin = () => {
    if (onLogin) {
      onLogin();
      return;
    }

    window.location.href = "/login";
  };

  return (
    <div className="session-expired-message" role="alert">
      <div>
        <h3>Your session has expired</h3>
        <p>
          For security reasons, please sign in again to continue using the
          pathology laboratory system.
        </p>
      </div>

      <button type="button" onClick={handleLogin}>
        Sign In Again
      </button>
    </div>
  );
};

export default SessionExpiredMessage;