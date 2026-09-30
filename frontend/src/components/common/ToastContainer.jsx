import React from "react";
import Toast from "./Toast";

const ToastContainer = ({ toasts = [], onClose }) => {
  if (!toasts.length) {
    return null;
  }

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          title={toast.title}
          type={toast.type}
          onClose={() => onClose?.(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;