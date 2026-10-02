import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Hash,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  AlertCircle,
} from "lucide-react";

import { getPatientById } from "../../services/patientService";
import "../../styles/patient-details.css";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPatient = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPatientById(id);
        setPatient(data);
      } catch (err) {
        setError(err.message || "Unable to load patient details.");
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="patient-details-page">
        <div className="patient-details-state">
          <div className="patient-details-spinner" />
          <p>Loading patient record...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="patient-details-page">
        <div className="patient-details-state patient-details-error-state">
          <AlertCircle size={30} />
          <h2>Unable to load patient</h2>
          <p>{error}</p>

          <button
            className="patient-details-back-button"
            onClick={() => navigate("/patients")}
          >
            <ArrowLeft size={16} />
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="patient-details-page">
        <div className="patient-details-state">
          <User size={30} />
          <h2>Patient not found</h2>
          <p>The requested patient record could not be found.</p>

          <button
            className="patient-details-back-button"
            onClick={() => navigate("/patients")}
          >
            <ArrowLeft size={16} />
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-details-page">
      {/* Header */}
      <div className="patient-details-header">
        <div className="patient-details-heading">
          <button
            className="patient-details-icon-button"
            onClick={() => navigate("/patients")}
            title="Back to patients"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <span className="patient-details-eyebrow">
              PATIENT MANAGEMENT
            </span>

            <h1>Patient Details</h1>

            <p>
              View demographic and contact information for this patient
              record.
            </p>
          </div>
        </div>
      </div>

      {/* Patient Identity Card */}
      <section className="patient-profile-card">
        <div className="patient-profile-avatar">
          <User size={30} />
        </div>

        <div className="patient-profile-main">
          <span className="patient-profile-label">PATIENT RECORD</span>

          <h2>{patient.name}</h2>

          <div className="patient-profile-id">
            <Hash size={14} />
            {patient.patientId}
          </div>
        </div>

        <div className="patient-profile-status">
          <span className="patient-status-dot" />
          Active Record
        </div>
      </section>

      {/* Information */}
      <section className="patient-information-card">
        <div className="patient-information-header">
          <div className="patient-information-title">
            <div className="patient-information-icon">
              <FileText size={17} />
            </div>

            <div>
              <h2>Patient Information</h2>
              <p>Basic demographic and contact details.</p>
            </div>
          </div>
        </div>

        <div className="patient-information-grid">
          <div className="patient-information-item">
            <div className="patient-information-item-icon">
              <Hash size={16} />
            </div>

            <div>
              <span>Patient ID</span>
              <strong>{patient.patientId}</strong>
            </div>
          </div>

          <div className="patient-information-item">
            <div className="patient-information-item-icon">
              <User size={16} />
            </div>

            <div>
              <span>Full Name</span>
              <strong>{patient.name}</strong>
            </div>
          </div>

          <div className="patient-information-item">
            <div className="patient-information-item-icon">
              <Calendar size={16} />
            </div>

            <div>
              <span>Age</span>
              <strong>{patient.age} years</strong>
            </div>
          </div>

          <div className="patient-information-item">
            <div className="patient-information-item-icon">
              <User size={16} />
            </div>

            <div>
              <span>Gender</span>
              <strong>{patient.gender || "-"}</strong>
            </div>
          </div>

          <div className="patient-information-item">
            <div className="patient-information-item-icon">
              <Phone size={16} />
            </div>

            <div>
              <span>Phone Number</span>
              <strong>{patient.phone || "-"}</strong>
            </div>
          </div>

          <div className="patient-information-item">
            <div className="patient-information-item-icon">
              <Mail size={16} />
            </div>

            <div>
              <span>Email Address</span>
              <strong>{patient.email || "-"}</strong>
            </div>
          </div>

          <div className="patient-information-item patient-information-full">
            <div className="patient-information-item-icon">
              <MapPin size={16} />
            </div>

            <div>
              <span>Address</span>
              <strong>{patient.address || "-"}</strong>
            </div>
          </div>

          <div className="patient-information-item patient-information-full">
            <div className="patient-information-item-icon">
              <FileText size={16} />
            </div>

            <div>
              <span>Medical History</span>
              <strong>{patient.medicalHistory || "-"}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <div className="patient-details-footer">
        <button
          className="patient-details-back-button"
          onClick={() => navigate("/patients")}
        >
          <ArrowLeft size={16} />
          Back to Patients
        </button>
      </div>
    </div>
  );
};

export default PatientDetails;