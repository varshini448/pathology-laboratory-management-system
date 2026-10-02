import { CheckCircle2, UserPlus } from "lucide-react";
import { useState } from "react";

import PatientForm from "../../components/forms/PatientForm";
import { createPatient } from "../../services/patientService";

import "../../styles/patient-form.css";

const AddPatient = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setMessage("");
      setError("");

      await createPatient(formData);

      setMessage("Patient record created successfully.");
    } catch (error) {
      setError(error.message || "Unable to create patient.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-registration-page">
      {/* Page Header */}

      <div className="patient-registration-header">
        <div className="patient-registration-heading">
          <div className="patient-registration-icon">
            <UserPlus size={23} />
          </div>

          <div>
            <span className="patient-registration-eyebrow">
              PATIENT MANAGEMENT
            </span>

            <h1>Register Patient</h1>

            <p>
              Create a new patient record in the pathology laboratory
              information system.
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}

      {message && (
        <div className="patient-form-message patient-form-success">
          <CheckCircle2 size={18} />

          <div>
            <strong>Registration successful</strong>
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* Error Message */}

      {error && (
        <div className="patient-form-message patient-form-error">
          <div>
            <strong>Registration failed</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Form */}

      <PatientForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default AddPatient;