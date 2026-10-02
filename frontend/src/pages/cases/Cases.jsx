import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseMedical,
  Plus,
  User,
  Stethoscope,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  ClipboardList,
} from "lucide-react";

import { getCases } from "../../services/caseService";
import "../../styles/cases.css";

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCases = async () => {
      try {
        setError("");

        const data = await getCases();
        setCases(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, []);

  const getPriorityClass = (priority) => {
    switch (priority?.toUpperCase()) {
      case "STAT":
        return "case-priority case-priority-stat";
      case "URGENT":
        return "case-priority case-priority-urgent";
      default:
        return "case-priority case-priority-normal";
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "case-status case-status-completed";

      case "REPORTED":
        return "case-status case-status-reported";

      case "IN_PROCESS":
        return "case-status case-status-process";

      case "SPECIMEN_COLLECTED":
        return "case-status case-status-process";

      default:
        return "case-status case-status-default";
    }
  };

  if (loading) {
    return (
      <div className="cases-page">
        <div className="cases-state">
          <div className="cases-spinner" />
          <p>Loading cases...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cases-page">
        <div className="cases-state cases-error-state">
          <AlertCircle size={30} strokeWidth={1.8} />

          <h2>Unable to load cases</h2>

          <p>{error}</p>

          <button
            type="button"
            className="cases-retry-button"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cases-page">
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <header className="cases-header">
        <div className="cases-heading">
          <div className="cases-header-icon">
            <BriefcaseMedical size={22} />
          </div>

          <div>
            <span className="cases-eyebrow">CASE MANAGEMENT</span>

            <h1>Cases</h1>

            <p>
              Manage pathology cases and monitor their diagnostic workflow.
            </p>
          </div>
        </div>

        <Link to="/cases/add" className="cases-add-button">
          <Plus size={16} />
          Add Case
        </Link>
      </header>

      {/* =====================================================
          SUMMARY
          ===================================================== */}

      <section className="cases-summary">
        <div className="cases-summary-card">
          <div className="cases-summary-icon">
            <BriefcaseMedical size={18} />
          </div>

          <div>
            <span>Total Cases</span>
            <strong>{cases.length}</strong>
          </div>
        </div>

        <div className="cases-summary-card">
          <div className="cases-summary-icon">
            <ClipboardList size={18} />
          </div>

          <div>
            <span>Active Records</span>
            <strong>
              {
                cases.filter(
                  (caseData) =>
                    caseData.status !== "COMPLETED" &&
                    caseData.status !== "REPORTED"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="cases-summary-card">
          <div className="cases-summary-icon">
            <AlertCircle size={18} />
          </div>

          <div>
            <span>Priority Cases</span>
            <strong>
              {
                cases.filter(
                  (caseData) =>
                    caseData.priority === "URGENT" ||
                    caseData.priority === "STAT"
                ).length
              }
            </strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          CASE TABLE
          ===================================================== */}

      <section className="cases-card">
        <div className="cases-card-header">
          <div>
            <h2>Case Records</h2>

            <p>
              Pathology cases registered in the laboratory system.
            </p>
          </div>

          <span className="cases-count">
            {cases.length} {cases.length === 1 ? "record" : "records"}
          </span>
        </div>

        {cases.length === 0 ? (
          <div className="cases-empty">
            <BriefcaseMedical size={34} strokeWidth={1.5} />

            <h3>No cases found</h3>

            <p>
              Create a new pathology case to begin laboratory processing.
            </p>

            <Link to="/cases/add" className="cases-add-button">
              <Plus size={15} />
              Add Case
            </Link>
          </div>
        ) : (
          <div className="cases-table-wrapper">
            <table className="cases-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Case Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Record</th>
                </tr>
              </thead>

              <tbody>
                {cases.map((caseData) => (
                  <tr key={caseData._id}>
                    {/* CASE ID */}
                    <td>
                      <Link
                        to={`/cases/${caseData._id}`}
                        className="case-id-link"
                      >
                        {caseData.caseId}
                      </Link>
                    </td>

                    {/* PATIENT */}
                    <td>
                      <div className="case-person-cell">
                        <div className="case-person-icon">
                          <User size={14} />
                        </div>

                        <div>
                          <strong>
                            {caseData.patient?.name || caseData.patient || "-"}
                          </strong>

                          <span>Patient</span>
                        </div>
                      </div>
                    </td>

                    {/* DOCTOR */}
                    <td>
                      <div className="case-person-cell">
                        <div className="case-person-icon">
                          <Stethoscope size={14} />
                        </div>

                        <div>
                          <strong>
                            {caseData.doctor?.name || caseData.doctor || "-"}
                          </strong>

                          <span>Doctor</span>
                        </div>
                      </div>
                    </td>

                    {/* CASE TYPE */}
                    <td>
                      <span className="case-type">
                        {caseData.caseType || "-"}
                      </span>
                    </td>

                    {/* PRIORITY */}
                    <td>
                      <span className={getPriorityClass(caseData.priority)}>
                        {caseData.priority || "NORMAL"}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td>
                      <span className={getStatusClass(caseData.status)}>
                        {(caseData.status || "UNKNOWN").replaceAll("_", " ")}
                      </span>
                    </td>

                    {/* RECORD */}
                    <td>
                      <Link
                        to={`/cases/${caseData._id}`}
                        className="case-view-link"
                      >
                        View
                        <ChevronRight size={13} />
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

export default Cases;