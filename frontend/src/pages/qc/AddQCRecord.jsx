
import { useEffect, useState } from "react";
import { createQCRecord } from "../../services/qcService";
import { getCases } from "../../services/caseService";
import { getSlides } from "../../services/slideService";
import PageHeader from "../../components/layout/PageHeader";
import LoadingState from "../../components/ui/LoadingState";

const AddQCRecord = () => {
  const [cases, setCases] = useState([]);
  const [slides, setSlides] = useState([]);

  const [formData, setFormData] = useState({
    qcId: "",
    case: "",
    slide: "",
    sectionQuality: "GOOD",
    stainingQuality: "GOOD",
    labelingCheck: "PASS",
    documentationCheck: "PASS",
    overallStatus: "PASSED",
    findings: "",
    correctiveAction: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [caseData, slideData] = await Promise.all([
          getCases(),
          getSlides(),
        ]);

        setCases(caseData);
        setSlides(slideData);
      } catch (err) {
        setError(err.message || "Failed to load cases and slides");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      setSaving(true);
      await createQCRecord(formData);

      setMessage("QC record created successfully.");

      setFormData({
        qcId: "",
        case: "",
        slide: "",
        sectionQuality: "GOOD",
        stainingQuality: "GOOD",
        labelingCheck: "PASS",
        documentationCheck: "PASS",
        overallStatus: "PASSED",
        findings: "",
        correctiveAction: "",
      });
    } catch (err) {
      setError(err.message || "Failed to create QC record");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading cases and slides..." />;
  }

  return (
    <main className="workflow-form-page">
      <PageHeader eyebrow="QUALITY ASSURANCE" title="Add QC record" description="Record slide quality checks and any corrective action required." />

      {message && <p className="workflow-form-success" role="status">{message}</p>}
      {error && <p className="workflow-form-error" role="alert">{error}</p>}

      <form className="workflow-entry-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="qcId">QC ID</label>
          <input
            type="text"
            id="qcId"
            name="qcId"
            value={formData.qcId}
            onChange={handleChange}
            placeholder="QC001"
            required
          />
        </div>

        <div>
          <label htmlFor="qcCase">Case</label>
          <select
            name="case"
            id="qcCase"
            value={formData.case}
            onChange={handleChange}
            required
          >
            <option value="">Select Case</option>

            {cases.map((caseItem) => (
              <option key={caseItem._id} value={caseItem._id}>
                {caseItem.caseId} - {caseItem.caseType}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="qcSlide">Slide</label>
          <select
            name="slide"
            id="qcSlide"
            value={formData.slide}
            onChange={handleChange}
            required
          >
            <option value="">Select Slide</option>

            {slides.map((slide) => (
              <option key={slide._id} value={slide._id}>
                {slide.slideId} - {slide.slideType}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sectionQuality">Section Quality</label>
          <select
            name="sectionQuality"
            id="sectionQuality"
            value={formData.sectionQuality}
            onChange={handleChange}
          >
            <option value="GOOD">GOOD</option>
            <option value="ACCEPTABLE">ACCEPTABLE</option>
            <option value="POOR">POOR</option>
          </select>
        </div>

        <div>
          <label htmlFor="stainingQuality">Staining Quality</label>
          <select
            name="stainingQuality"
            id="stainingQuality"
            value={formData.stainingQuality}
            onChange={handleChange}
          >
            <option value="GOOD">GOOD</option>
            <option value="ACCEPTABLE">ACCEPTABLE</option>
            <option value="POOR">POOR</option>
          </select>
        </div>

        <div>
          <label htmlFor="labelingCheck">Labeling Check</label>
          <select
            name="labelingCheck"
            id="labelingCheck"
            value={formData.labelingCheck}
            onChange={handleChange}
          >
            <option value="PASS">PASS</option>
            <option value="FAIL">FAIL</option>
          </select>
        </div>

        <div>
          <label htmlFor="documentationCheck">Documentation Check</label>
          <select
            name="documentationCheck"
            id="documentationCheck"
            value={formData.documentationCheck}
            onChange={handleChange}
          >
            <option value="PASS">PASS</option>
            <option value="FAIL">FAIL</option>
          </select>
        </div>

        <div>
          <label htmlFor="overallStatus">Overall Status</label>
          <select
            name="overallStatus"
            id="overallStatus"
            value={formData.overallStatus}
            onChange={handleChange}
          >
            <option value="PASSED">PASSED</option>
            <option value="FAILED">FAILED</option>
            <option value="NEEDS_REVIEW">NEEDS_REVIEW</option>
          </select>
        </div>

        <div>
          <label htmlFor="findings">Findings</label>
          <textarea
            name="findings"
            id="findings"
            value={formData.findings}
            onChange={handleChange}
            placeholder="Enter QC findings"
            rows="4"
          />
        </div>

        <div>
          <label htmlFor="correctiveAction">Corrective Action</label>
          <textarea
            name="correctiveAction"
            id="correctiveAction"
            value={formData.correctiveAction}
            onChange={handleChange}
            placeholder="Enter corrective action if required"
            rows="4"
          />
        </div>

        <button type="submit" disabled={saving}>{saving ? "Saving..." : "Create QC record"}</button>
      </form>
    </main>
  );
};

export default AddQCRecord;
