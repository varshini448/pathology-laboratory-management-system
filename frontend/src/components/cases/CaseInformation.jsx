import {
  CalendarDays,
  FileText,
  Hash,
  Stethoscope,
} from "lucide-react";

const CaseInformation = ({ caseData }) => {
  return (
    <section className="case-details-card case-information-card">
      <div className="case-section-header">
        <div className="case-section-icon">
          <FileText size={19} />
        </div>

        <div>
          <span className="case-section-eyebrow">CASE RECORD</span>
          <h2>Case Information</h2>
          <p>Clinical and administrative details associated with this case.</p>
        </div>
      </div>

      <div className="case-information-grid">
        <div className="case-information-item">
          <span className="case-information-label">
            <Hash size={15} />
            Case ID
          </span>
          <strong>{caseData.caseId || "—"}</strong>
        </div>

        <div className="case-information-item">
          <span className="case-information-label">
            <Stethoscope size={15} />
            Case Type
          </span>
          <strong>{caseData.caseType || "—"}</strong>
        </div>

        <div className="case-information-item">
          <span className="case-information-label">
            <CalendarDays size={15} />
            Created Date
          </span>
          <strong>
            {caseData.createdAt
              ? new Date(caseData.createdAt).toLocaleDateString()
              : "—"}
          </strong>
        </div>
      </div>

      <div className="case-clinical-history">
        <span className="case-information-label">
          <FileText size={15} />
          Clinical History
        </span>

        <p>{caseData.clinicalHistory || "No clinical history recorded."}</p>
      </div>
    </section>
  );
};

export default CaseInformation;