import { Save } from "lucide-react";

const AddCaseForm = ({
  formData,
  patients,
  doctors,
  saving,
  onChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <form className="add-case-form" onSubmit={onSubmit}>
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
              required
            >
              <option value="">Select patient</option>

              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
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
              onChange={onChange}
              required
            >
              <option value="">Select doctor</option>

              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.doctorId} — {doctor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="add-case-field add-case-field-full">
            <label htmlFor="priority">Case Priority</label>

            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={onChange}
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
              onChange={onChange}
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
          onClick={onCancel}
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
  );
};

export default AddCaseForm;
