import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Users,
  User,
  Calendar,
  Phone,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { getPatients } from "../../services/patientService";
import "../../styles/patients.css";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      setError(err.message || "Unable to load patients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  if (loading) {
    return (
      <div className="patients-page">
        <div className="patients-state">
          <div className="patients-spinner" />
          <p>Loading patient records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="patients-page">
        <div className="patients-state patients-error-state">
          <AlertCircle size={30} />
          <h2>Unable to load patients</h2>
          <p>{error}</p>

          <button
            className="patients-retry-button"
            onClick={loadPatients}
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="patients-page">
      {/* Page Header */}
      <div className="patients-header">
        <div className="patients-heading">
          <div className="patients-header-icon">
            <Users size={23} />
          </div>

          <div>
            <span className="patients-eyebrow">
              PATIENT MANAGEMENT
            </span>

            <h1>Patients</h1>

            <p>
              Manage and review patient records registered in the
              pathology laboratory.
            </p>
          </div>
        </div>

        <Link
          to="/patients/add"
          className="patients-add-button"
        >
          <UserPlus size={17} />
          Add Patient
        </Link>
      </div>

      {/* Summary */}
      <div className="patients-summary">
        <div className="patients-summary-card">
          <div className="patients-summary-icon">
            <Users size={18} />
          </div>

          <div>
            <span>Total Patients</span>
            <strong>{patients.length}</strong>
          </div>
        </div>

        <div className="patients-summary-card">
          <div className="patients-summary-icon">
            <User size={18} />
          </div>

          <div>
            <span>Records Available</span>
            <strong>{patients.length}</strong>
          </div>
        </div>
      </div>

      {/* Patient Table / List */}
      <section className="patients-card">
        <div className="patients-card-header">
          <div>
            <h2>Patient Records</h2>
            <p>
              Select a patient to view their complete record.
            </p>
          </div>

          <span className="patients-count">
            {patients.length}{" "}
            {patients.length === 1 ? "record" : "records"}
          </span>
        </div>

        {patients.length === 0 ? (
          <div className="patients-empty">
            <Users size={34} />

            <h3>No patients found</h3>

            <p>
              No patient records are currently available.
            </p>

            <Link
              to="/patients/add"
              className="patients-add-button"
            >
              <UserPlus size={16} />
              Register Patient
            </Link>
          </div>
        ) : (
          <div className="patients-table-wrapper">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Record</th>
                </tr>
              </thead>

              <tbody>
                {patients.map((patient) => (
                  <tr key={patient._id}>
                    <td>
                      <Link
                        to={`/patients/${patient._id}`}
                        className="patients-id-link"
                      >
                        {patient.patientId}
                      </Link>
                    </td>

                    <td>
                      <div className="patients-name-cell">
                        <div className="patients-avatar">
                          <User size={16} />
                        </div>

                        <div>
                          <strong>{patient.name}</strong>
                          <span>Patient</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="patients-detail-cell">
                        <Calendar size={14} />
                        {patient.age || "-"}
                      </div>
                    </td>

                    <td>
                      <span className="patients-gender-badge">
                        {patient.gender || "-"}
                      </span>
                    </td>

                    <td>
                      <div className="patients-detail-cell">
                        <Phone size={14} />
                        {patient.phone || "-"}
                      </div>
                    </td>

                    <td>
                      <Link
                        to={`/patients/${patient._id}`}
                        className="patients-view-link"
                      >
                        View
                        <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Patients;