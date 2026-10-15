import { useMemo, useState } from "react";

const sections = [
  { key: "diagnosis", label: "Diagnosis" },
  { key: "microscopicFindings", label: "Microscopic Findings" },
  { key: "grossFindings", label: "Gross Findings" },
  { key: "interpretation", label: "Interpretation" },
  { key: "recommendations", label: "Recommendations" },
];

const PathologistReportForm = ({ formData, onChange, onSubmit, saving }) => {
  const [showAssistant, setShowAssistant] = useState(false);

  const review = useMemo(() => {
    const completed = sections.filter(({ key }) =>
      String(formData[key] || "").trim()
    );
    const missing = sections.filter(
      ({ key }) => !String(formData[key] || "").trim()
    );
    const preview = sections
      .filter(({ key }) => String(formData[key] || "").trim())
      .map(({ key, label }) => `${label}\n${formData[key].trim()}`)
      .join("\n\n");

    return { completed, missing, preview };
  }, [formData]);

  const copyPreview = async () => {
    if (!review.preview) return;

    try {
      await navigator.clipboard.writeText(review.preview);
      window.alert("Draft preview copied. Please review it carefully.");
    } catch {
      window.alert("Clipboard unavailable. You can select and copy the preview manually.");
    }
  };

  return (
    <section className="report-info-panel report-form-panel">
      <h2>Pathologist Report</h2>

      <section className="report-assistant" aria-labelledby="report-assistant-title">
        <div className="report-assistant-heading">
          <div>
            <span className="report-assistant-label">REPORT REVIEW SUPPORT</span>
            <h3 id="report-assistant-title">Report Draft Assistant</h3>
          </div>
          <button
            type="button"
            className="report-assistant-toggle"
            onClick={() => setShowAssistant((current) => !current)}
            aria-expanded={showAssistant}
          >
            {showAssistant ? "Hide review" : "Review draft"}
          </button>
        </div>

        <p>
          Check report completeness and prepare a structured preview using
          information you entered. This tool does not diagnose or verify findings.
        </p>

        <p className="report-assistant-metrics">
          <strong>{review.completed.length}/{sections.length}</strong> sections completed
          {" · "}
          <strong>{review.missing.length}</strong> need attention
        </p>

        {showAssistant && (
          <div className="report-assistant-results" aria-live="polite">
            <h4>Completeness check</h4>
            {review.missing.length > 0 ? (
              <ul>
                {review.missing.map(({ key, label }) => (
                  <li key={key}>Missing: {label}</li>
                ))}
              </ul>
            ) : (
              <p>All sections contain text. Professional review is still required.</p>
            )}

            <h4>Structured draft preview</h4>
            {review.preview ? (
              <>
                <pre className="report-assistant-preview">{review.preview}</pre>
                <button type="button" className="report-assistant-copy" onClick={copyPreview}>
                  Copy preview
                </button>
              </>
            ) : (
              <p>Enter report information below to prepare a preview.</p>
            )}

            <p className="report-assistant-disclaimer">
              Completeness and formatting support only — not a diagnostic AI
              system. The responsible pathologist must verify all report content.
            </p>
          </div>
        )}
      </section>

      <form className="report-entry-form" onSubmit={onSubmit}>
        {sections.map(({ key, label }) => (
          <div key={key}>
            <label htmlFor={`report-${key}`}>{label}</label>
            <textarea
              id={`report-${key}`}
              name={key}
              value={formData[key] || ""}
              onChange={onChange}
              placeholder={`Enter ${label.toLowerCase()}`}
              rows={key === "diagnosis" ? 5 : 6}
              required={key === "diagnosis"}
            />
          </div>
        ))}

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Report Draft"}
        </button>
      </form>
    </section>
  );
};

export default PathologistReportForm;
