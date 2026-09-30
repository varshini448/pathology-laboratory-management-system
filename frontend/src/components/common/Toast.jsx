import React from "react";

const Toast = ({
  message,
  type = "info",
  onClose,
  title,
}) => {
  return (
    <div
      className={`toast toast-${type}`}
      role={type === "error" ? "alert" : "status"}
    >
      <div className="toast-content">
        {title && <strong>{title}</strong>}
        <span>{message}</span>
      </div>

      {onClose && (
        <button
          type="button"
          className="toast-close"
          onClick={onClose}
          aria-label="Close notification"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Toast;