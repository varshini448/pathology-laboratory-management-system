import { ArrowLeft, ClipboardPlus } from "lucide-react";

const AddCaseHeader = ({ onBack }) => {
  return (
    <header className="add-case-header">
      <button
        type="button"
        className="add-case-back-button"
        onClick={onBack}
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
  );
};

export default AddCaseHeader;
