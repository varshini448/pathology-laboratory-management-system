import { useState } from "react";
import { createQCRecord } from "../../services/qcService";

const AddQCRecord = () => {
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

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
    }
  };

  return (
    <div>
      <h1>Add QC Record</h1>

      {message && <p>{message}</p>}
      {error && <p>Error: {error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>QC ID</label>
          <input
            type="text"
            name="qcId"
            value={formData.qcId}
            onChange={handleChange}
            placeholder="QC001"
            required
          />
        </div>

        <div>
          <label>Case ID</label>
          <input
            type="text"
            name="case"
            value={formData.case}
            onChange={handleChange}
            placeholder="MongoDB Case ID"
            required
          />
        </div>

        <div>
          <label>Slide ID</label>
          <input
            type="text"
            name="slide"
            value={formData.slide}
            onChange={handleChange}
            placeholder="MongoDB Slide ID"
            required
          />
        </div>

        <div>
          <label>Section Quality</label>
          <select
            name="sectionQuality"
            value={formData.sectionQuality}
            onChange={handleChange}
          >
            <option value="GOOD">GOOD</option>
            <option value="ACCEPTABLE">ACCEPTABLE</option>
            <option value="POOR">POOR</option>
          </select>
        </div>

        <div>
          <label>Staining Quality</label>
          <select
            name="stainingQuality"
            value={formData.stainingQuality}
            onChange={handleChange}
          >
            <option value="GOOD">GOOD</option>
            <option value="ACCEPTABLE">ACCEPTABLE</option>
            <option value="POOR">POOR</option>
          </select>
        </div>

        <div>
          <label>Labeling Check</label>
          <select
            name="labelingCheck"
            value={formData.labelingCheck}
            onChange={handleChange}
          >
            <option value="PASS">PASS</option>
            <option value="FAIL">FAIL</option>
          </select>
        </div>

        <div>
          <label>Documentation Check</label>
          <select
            name="documentationCheck"
            value={formData.documentationCheck}
            onChange={handleChange}
          >
            <option value="PASS">PASS</option>
            <option value="FAIL">FAIL</option>
          </select>
        </div>

        <div>
          <label>Overall Status</label>
          <select
            name="overallStatus"
            value={formData.overallStatus}
            onChange={handleChange}
          >
            <option value="PASSED">PASSED</option>
            <option value="FAILED">FAILED</option>
            <option value="NEEDS_REVIEW">NEEDS_REVIEW</option>
          </select>
        </div>

        <div>
          <label>Findings</label>
          <textarea
            name="findings"
            value={formData.findings}
            onChange={handleChange}
            placeholder="Enter QC findings"
            rows="4"
          />
        </div>

        <div>
          <label>Corrective Action</label>
          <textarea
            name="correctiveAction"
            value={formData.correctiveAction}
            onChange={handleChange}
            placeholder="Enter corrective action if required"
            rows="4"
          />
        </div>

        <button type="submit">Create QC Record</button>
      </form>
    </div>
  );
};

export default AddQCRecord;