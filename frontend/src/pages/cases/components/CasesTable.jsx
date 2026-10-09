import { Link } from "react-router-dom";
import {
  BriefcaseMedical,
  Plus,
  User,
  Stethoscope,
  ChevronRight,
} from "lucide-react";

import {
  getPriorityClass,
  getStatusClass,
} from "./CaseStatusUtils";

const CasesTable = ({ cases }) => {
  return (
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
                  <td>
                    <Link
                      to={`/cases/${caseData.caseId}`}
                      className="case-id-link"
                    >
                      {caseData.caseId}
                    </Link>
                  </td>

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

                  <td>
                    <span className="case-type">
                      {caseData.caseType || "-"}
                    </span>
                  </td>

                  <td>
                    <span className={getPriorityClass(caseData.priority)}>
                      {caseData.priority || "NORMAL"}
                    </span>
                  </td>

                  <td>
                    <span className={getStatusClass(caseData.status)}>
                      {(caseData.status || "UNKNOWN").replaceAll("_", " ")}
                    </span>
                  </td>

                  <td>
                    <Link
                      to={`/cases/${caseData.caseId}`}
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
  );
};

export default CasesTable;
