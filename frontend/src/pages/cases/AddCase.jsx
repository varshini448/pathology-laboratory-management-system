import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardPlus, Save } from "lucide-react";

import { createCase } from "../../services/caseService";
import { getPatients } from "../../services/patientService";
import { getDoctors } from "../../services/doctorService";

import "../../styles/add-case.css";

const AddCase = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    caseId: "",
    patient: "",
    doctor: "",
    caseType: "",
    clinicalHistory: "",
    priority: "NORMAL",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadFormData = async () => {
      try {
        setLoading(true);
        setError("");

        const [patientData, doctorData] = await Promise.all([
          getPatients(),
          getDoctors(),
        ]);

        setPatients(patientData || []);
        setDoctors(doctorData || []);
      } catch (err) {
        setError(
          err?.message || "Failed to load patients and doctors."
        );
      } finally {
        setLoading(false);
      }
    };

    loadFormData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const createdCase = await createCase(formData);

      setSuccess("Case registered successfully.");

      setTimeout(() => {
        navigate(`/cases/${createdCase.caseId}`);
      }, 700);
    } catch (err) {
      setError(
        err?.message || "Failed to register the case."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="add-case-page">
        <div className="add-case-state">
          <p>Loading case registration data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-case-page">
      <header className="add-case-header">
        <button
          type="button"
          className="add-case-back-button"
          onClick={() => navigate("/cases")}
        >
          <ArrowLeft size={17} />
          Back to Cases
        </button>

        <div className="add-case-title-row">
          <div className="add-case-title-icon">
            <ClipboardPlus size={24} />
          </div>

          <div>
            <span className="add-case-eyebrow">
              CASE MANAGEMENT
            </span>

            <h1>Register New Case</h1>

            <p>
              Create a pathology case and associate it with the
              patient and responsible doctor.
            </p>
          </div>
        </div>
      </header>

      {error && (
        <div className="add-case-message add-case-message-error">
          {error}
        </div>
      )}

      {success && (
        <div className="add-case-message add-case-message-success">
          {success}
        </div>
      )}

      <form className="add-case-form" onSubmit={handleSubmit}>
        <section className="add-case-card">
          <div className="add-case-card-header">
            <div>
              <span className="add-case-section-label">
                CASE INFORMATION
              </span>
              <h2>Case Registration Details</h2>
              <p>
                Enter the core information required to begin
                laboratory processing.
              </p>
            </div>
          </div>

          <div className="add-case-grid">
            <div className="add-case-field">
              <label htmlFor="caseId">
                Case ID <span>*</span>
              </label>

              <input
                id="caseId"
                name="caseId"
                type="text"
                value={formData.caseId}
                onChange={handleChange}
                placeholder="e.g. CASE002"
                required
              />

              <small>
                Use a unique laboratory case identifier.
              </small>
            </div>

            <div className="add-case-field">
              <label htmlFor="caseType">
                Case Type <span>*</span>
              </label>

              <input
                id="caseType"
                name="caseType"
                type="text"
                value={formData.caseType}
                onChange={handleChange}
                placeholder="e.g. Histopathology"
                required
              />
            </div>

            <div className="add-case-field">
              <label htmlFor="patient">
                Patient <span>*</span>
              </label>

              <select
                id="patient"
                name="patient"
                value={formData.patient}
                onChange={handleChange}
                required
              >
                <option value="">Select patient</option>

                {patients.map((patient) => (
                  <option
                    key={patient._id}
                    value={patient._id}
                  >
                    {patient.patientId} — {patient.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="add-case-field">
              <label htmlFor="doctor">
                Referring Doctor <span>*</span>
              </label>

              <select
                id="doctor"
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                required
              >
                <option value="">Select doctor</option>

                {doctors.map((doctor) => (
                  <option
                    key={doctor._id}
                    value={doctor._id}
                  >
                    {doctor.doctorId} — {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="add-case-field add-case-field-full">
              <label htmlFor="priority">
                Case Priority
              </label>

              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent</option>
                <option value="STAT">STAT</option>
              </select>
            </div>

            <div className="add-case-field add-case-field-full">
              <label htmlFor="clinicalHistory">
                Clinical History
              </label>

              <textarea
                id="clinicalHistory"
                name="clinicalHistory"
                value={formData.clinicalHistory}
                onChange={handleChange}
                placeholder="Enter relevant clinical history, symptoms, provisional diagnosis, or other clinical information."
                rows={5}
              />
            </div>
          </div>
        </section>

        <div className="add-case-form-footer">
          <button
            type="button"
            className="add-case-cancel-button"
            onClick={() => navigate("/cases")}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="add-case-submit-button"
            disabled={saving}
          >
            <Save size={17} />
            {saving ? "Registering Case..." : "Register Case"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCase;
