import React from "react";

const SpecimenForm = ({
  values = {},
  onChange,
  onSubmit,
  loading = false,
}) => {
  const handleChange = (event) => {
    onChange?.({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <form className="common-form" onSubmit={onSubmit}>
      <div className="form-section-title">
        <h2>Specimen Information</h2>
        <p>Enter specimen collection and accessioning details.</p>
      </div>

      <div className="form-grid">
        <label>
          Specimen ID
          <input
            name="specimenId"
            value={values.specimenId || ""}
            onChange={handleChange}
            placeholder="SPEC001"
            required
          />
        </label>

        <label>
          Case ID
          <input
            name="caseId"
            value={values.caseId || ""}
            onChange={handleChange}
            placeholder="CASE001"
            required
          />
        </label>

        <label>
          Specimen Type
          <input
            name="specimenType"
            value={values.specimenType || ""}
            onChange={handleChange}
            placeholder="Tissue"
            required
          />
        </label>

        <label>
          Collection Date
          <input
            type="datetime-local"
            name="collectionDate"
            value={values.collectionDate || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Collection Site
          <input
            name="collectionSite"
            value={values.collectionSite || ""}
            onChange={handleChange}
            placeholder="Collection site"
          />
        </label>

        <label>
          Quality
          <select
            name="quality"
            value={values.quality || ""}
            onChange={handleChange}
          >
            <option value="">Select quality</option>
            <option value="GOOD">Good</option>
            <option value="ACCEPTABLE">Acceptable</option>
            <option value="POOR">Poor</option>
          </select>
        </label>
      </div>

      <label>
        Clinical Notes
        <textarea
          name="clinicalNotes"
          value={values.clinicalNotes || ""}
          onChange={handleChange}
          placeholder="Enter relevant clinical notes"
          rows="4"
        />
      </label>

      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Specimen"}
        </button>
      </div>
    </form>
  );
};

export default SpecimenForm;