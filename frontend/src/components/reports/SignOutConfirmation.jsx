import React from "react";

const SignOutConfirmation = ({
  report,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <div className="signout-confirmation">
      <div className="signout-confirmation-icon" aria-hidden="true">
        ✓
      </div>

      <h2>Confirm Report Sign-out</h2>

      <p>
        You are about to finalize this pathology report. Once signed out,
        the report will be marked as FINAL.
      </p>

      {report?.reportId && (
        <div className="signout-report-reference">
          <span>Report ID</span>
          <strong>{report.reportId}</strong>
        </div>
      )}

      <div className="signout-confirmation-actions">
        <button
          type="button"
          className="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Signing Out..." : "Confirm Sign-out"}
        </button>
      </div>
    </div>
  );
};

export default SignOutConfirmation;