import React from "react";

const ReportForm = ({
  values = {},
  onChange,
  onSubmit,
  loading = false,
  readOnly = false,
}) => {
  const handleChange = (event) => {
    onChange?.({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <form className="common-form report-form" onSubmit={onSubmit}>
      <div className="form-section-title">
        <h2>Pathology Report</h2>
        <p>Enter the diagnostic findings and report information.</p>
      </div>

      <div className="form-grid">
        <label>
          Report ID
          <input
            name="reportId"
            value={values.reportId || ""}
            onChange={handleChange}
            placeholder="REP-001"
            readOnly={readOnly}
          />
        </label>

        <label>
          Case ID
          <input
            name="caseId"
            value={values.caseId || ""}
            onChange={handleChange}
            placeholder="CASE001"
            readOnly={readOnly}
          />
        </label>
      </div>

      <label>
        Diagnosis
        <textarea
          name="diagnosis"
          value={values.diagnosis || ""}
          onChange={handleChange}
          placeholder="Enter diagnosis"
          rows="4"
          required
          readOnly={readOnly}
        />
      </label>

      <label>
        Microscopic Findings
        <textarea
          name="microscopicFindings"
          value={values.microscopicFindings || ""}
          onChange={handleChange}
          placeholder="Enter microscopic findings"
          rows="5"
          readOnly={readOnly}
        />
      </label>

      <label>
        Gross Findings
        <textarea
          name="grossFindings"
          value={values.grossFindings || ""}
          onChange={handleChange}
          placeholder="Enter gross findings"
          rows="4"
          readOnly={readOnly}
        />
      </label>

      <label>
        Interpretation
        <textarea
          name="interpretation"
          value={values.interpretation || ""}
          onChange={handleChange}
          placeholder="Enter interpretation"
          rows="4"
          readOnly={readOnly}
        />
      </label>

      <label>
        Recommendations
        <textarea
          name="recommendations"
          value={values.recommendations || ""}
          onChange={handleChange}
          placeholder="Enter recommendations"
          rows="4"
          readOnly={readOnly}
        />
      </label>

      {!readOnly && (
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Report"}
          </button>
        </div>
      )}
    </form>
  );
};

export default ReportForm;