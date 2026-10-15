import { useEffect, useState } from "react";
import { getPatients } from "../../services/patientService";
import { getDoctors } from "../../services/doctorService";

const initialFormData = {
  caseId: "",
  patient: "",
  doctor: "",
  caseType: "",
  priority: "NORMAL",
  clinicalHistory: "",
};

const CaseForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([getPatients(), getDoctors()])
      .then(([patientData, doctorData]) => {
        if (!active) return;
        setPatients(Array.isArray(patientData) ? patientData : []);
        setDoctors(Array.isArray(doctorData) ? doctorData : []);
      })
      .catch((error) => {
        if (active) setLoadError(error.message || "Unable to load patients and doctors.");
      })
      .finally(() => {
        if (active) setRecordsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const submitted = await onSubmit(formData);
    if (submitted === false) return;

    setFormData(initialFormData);
  };

  return (
    <form className="workflow-entry-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="caseId">Case ID</label>
        <input id="caseId" name="caseId" type="text" value={formData.caseId}
          onChange={handleChange} placeholder="e.g. CASE002" required />
      </div>

      <div>
        <label htmlFor="patient">Patient</label>
        <select id="patient" name="patient" value={formData.patient}
          onChange={handleChange} required disabled={recordsLoading || patients.length === 0}>
          <option value="">{recordsLoading ? "Loading patients..." : "Select a patient"}</option>
          {patients.map((patient) => (
            <option key={patient._id} value={patient._id}>
              {patient.patientId} — {patient.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="doctor">Referring Doctor</label>
        <select id="doctor" name="doctor" value={formData.doctor}
          onChange={handleChange} required disabled={recordsLoading || doctors.length === 0}>
          <option value="">{recordsLoading ? "Loading doctors..." : "Select a doctor"}</option>
          {doctors.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>
              {doctor.doctorId} — {doctor.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="caseType">Case Type</label>
        <input id="caseType" name="caseType" type="text" value={formData.caseType}
          onChange={handleChange} placeholder="e.g. HISTOPATHOLOGY" required />
      </div>

      <div>
        <label htmlFor="priority">Priority</label>
        <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
          <option value="NORMAL">Normal</option>
          <option value="URGENT">Urgent</option>
          <option value="STAT">STAT</option>
        </select>
      </div>

      <div>
        <label htmlFor="clinicalHistory">Clinical History</label>
        <textarea id="clinicalHistory" name="clinicalHistory"
          value={formData.clinicalHistory} onChange={handleChange}
          placeholder="Enter clinical history" />
      </div>

      {loadError && <p className="workflow-form-error" role="alert">{loadError}</p>}
      {!recordsLoading && patients.length === 0 && (
        <p role="status">No patients available. Register a patient first.</p>
      )}
      {!recordsLoading && doctors.length === 0 && (
        <p role="status">No doctors available. Register a doctor first.</p>
      )}

      <button type="submit" disabled={loading || recordsLoading ||
        patients.length === 0 || doctors.length === 0}>
        {loading ? "Creating..." : "Create Case"}
      </button>
    </form>
  );
};

export default CaseForm;
