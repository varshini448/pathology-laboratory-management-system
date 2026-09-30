import React, { useState } from "react";

const ReportAmendmentForm = ({
  reportId,
  onSubmit,
  loading = false,
}) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit?.({
      reportId,
      reason,
      details,
    });
  };

  return (
    <form className="report-amendment-form" onSubmit={handleSubmit}>
      <div className="form-section-title">
        <h2>Report Amendment</h2>
        <p>
          Record the reason and details for changing a finalized report.
        </p>
      </div>

      <label>
        Amendment Reason
        <select
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          required
        >
          <option value="">Select reason</option>
          <option value="DIAGNOSIS_CORRECTION">
            Diagnosis Correction
          </option>
          <option value="DATA_CORRECTION">
            Patient / Case Data Correction
          </option>
          <option value="ADDITIONAL_FINDINGS">
            Additional Findings
          </option>
          <option value="OTHER">Other</option>
        </select>
      </label>

      <label>
        Amendment Details
        <textarea
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          placeholder="Explain the amendment..."
          rows="5"
          required
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Saving Amendment..." : "Save Amendment"}
      </button>
    </form>
  );
};

export default ReportAmendmentForm;