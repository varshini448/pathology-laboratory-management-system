const PathologistReportForm = ({
  formData,
  onChange,
  onSubmit,
  saving,
}) => {
  return (
    <section>
      <h2>Pathologist Report</h2>

      <form onSubmit={onSubmit}>
        <div>
          <label>Diagnosis</label>
          <br />

          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={onChange}
            placeholder="Enter the diagnosis"
            rows="5"
            required
          />
        </div>

        <br />

        <div>
          <label>Microscopic Findings</label>
          <br />

          <textarea
            name="microscopicFindings"
            value={formData.microscopicFindings}
            onChange={onChange}
            placeholder="Enter microscopic findings"
            rows="6"
          />
        </div>

        <br />

        <div>
          <label>Gross Findings</label>
          <br />

          <textarea
            name="grossFindings"
            value={formData.grossFindings}
            onChange={onChange}
            placeholder="Enter gross findings"
            rows="6"
          />
        </div>

        <br />

        <div>
          <label>Interpretation</label>
          <br />

          <textarea
            name="interpretation"
            value={formData.interpretation}
            onChange={onChange}
            placeholder="Enter professional interpretation"
            rows="6"
          />
        </div>

        <br />

        <div>
          <label>Recommendations</label>
          <br />

          <textarea
            name="recommendations"
            value={formData.recommendations}
            onChange={onChange}
            placeholder="Enter recommendations if applicable"
            rows="5"
          />
        </div>

        <br />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Report Draft"}
        </button>
      </form>
    </section>
  );
};

export default PathologistReportForm;