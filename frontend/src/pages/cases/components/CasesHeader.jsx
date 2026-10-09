import { Link } from "react-router-dom";
import { BriefcaseMedical, Plus } from "lucide-react";

const CasesHeader = () => {
  return (
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
  );
};

export default CasesHeader;
