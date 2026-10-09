import {
  BriefcaseMedical,
  ClipboardList,
  AlertCircle,
} from "lucide-react";

const CasesSummary = ({ cases }) => {
  const activeCases = cases.filter(
    (caseData) =>
      caseData.status !== "COMPLETED" &&
      caseData.status !== "REPORTED"
  ).length;

  const priorityCases = cases.filter(
    (caseData) =>
      caseData.priority === "URGENT" ||
      caseData.priority === "STAT"
  ).length;

  return (
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
          <strong>{activeCases}</strong>
        </div>
      </div>

      <div className="cases-summary-card">
        <div className="cases-summary-icon">
          <AlertCircle size={18} />
        </div>

        <div>
          <span>Priority Cases</span>
          <strong>{priorityCases}</strong>
        </div>
      </div>
    </section>
  );
};

export default CasesSummary;
