import { useState } from "react";

const CaseForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    caseId: "",
    patient: "",
    doctor: "",
    caseType: "",
    priority: "NORMAL",
    clinicalHistory: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit(formData);

    setFormData({
      caseId: "",
      patient: "",
      doctor: "",
      caseType: "",
      priority: "NORMAL",
      clinicalHistory: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Case ID</label>
        <input
          type="text"
          name="caseId"
          value={formData.caseId}
          onChange={handleChange}
          placeholder="CASE002"
          required
        />
      </div>

      <div>
        <label>Patient ID</label>
        <input
          type="text"
          name="patient"
          value={formData.patient}
          onChange={handleChange}
          placeholder="Patient MongoDB ID"
          required
        />
      </div>

      <div>
        <label>Doctor ID</label>
        <input
          type="text"
          name="doctor"
          value={formData.doctor}
          onChange={handleChange}
          placeholder="Doctor MongoDB ID"
          required
        />
      </div>

      <div>
        <label>Case Type</label>
        <input
          type="text"
          name="caseType"
          value={formData.caseType}
          onChange={handleChange}
          placeholder="HISTOPATHOLOGY"
          required
        />
      </div>

      <div>
        <label>Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="NORMAL">Normal</option>
          <option value="URGENT">Urgent</option>
          <option value="STAT">STAT</option>
        </select>
      </div>

      <div>
        <label>Clinical History</label>
        <textarea
          name="clinicalHistory"
          value={formData.clinicalHistory}
          onChange={handleChange}
          placeholder="Enter clinical history"
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Case"}
      </button>
    </form>
  );
};

export default CaseForm;