import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseMedical,
  User,
  Stethoscope,
  Activity,
  Clock3,
  FlaskConical,
  Boxes,
  ScanLine,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import useCaseDetails from "../../hooks/useCaseDetails";
import CaseInformation from "../../components/cases/CaseInformation";
import CaseProcessingSummary from "../../components/cases/CaseProcessingSummary";
import CaseWorkflow from "../../components/cases/CaseWorkflow";

import "../../styles/case-details.css";
import "../../styles/case-details-information.css";
import "../../styles/case-details-sections.css";

import "../../styles/workflow-action.css";
import "../../styles/workflow-status.css";
import "../../styles/workflow-timeline.css";
import "../../styles/workflow-stepper.css";
const CaseDetails = () => {
  const { id } = useParams();

  const {
    caseData,
    workflowEvents,
    specimens,
    blocks,
    slides,
    loading,
    workflowLoading,
    error,
    loadWorkflow,
  } = useCaseDetails(id);

  if (loading) {
    return (
      <div className="case-details-page">
        <div className="case-details-state">
          <div className="case-details-spinner" />
          <p>Loading case details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="case-details-page">
        <div className="case-details-state case-details-error">
          <AlertCircle size={32} strokeWidth={1.8} />

          <h2>Unable to load case</h2>

          <p>{error}</p>

          <button
            type="button"
            className="case-details-retry"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="case-details-page">
        <div className="case-details-state">
          <BriefcaseMedical size={34} strokeWidth={1.5} />

          <h2>Case not found</h2>

          <p>The requested case record could not be found.</p>

          <Link to="/cases" className="case-details-back-button">
            <ArrowLeft size={14} />
            Back to Cases
          </Link>
        </div>
      </div>
    );
  }

  const priority = caseData.priority || "NORMAL";
  const status = caseData.status || "UNKNOWN";

  const priorityClass =
    priority === "STAT"
      ? "case-detail-badge case-detail-priority-stat"
      : priority === "URGENT"
        ? "case-detail-badge case-detail-priority-urgent"
        : "case-detail-badge case-detail-priority-normal";

  const statusClass =
    status === "COMPLETED" || status === "REPORTED"
      ? "case-detail-badge case-detail-status-complete"
      : "case-detail-badge case-detail-status-process";

  return (
    <div className="case-details-page">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="case-details-header">
        <div>
          <Link to="/cases" className="case-details-back-link">
            <ArrowLeft size={14} />
            Back to Cases
          </Link>

          <div className="case-details-title-row">
            <div className="case-details-title-icon">
              <BriefcaseMedical size={22} />
            </div>

            <div>
              <span className="case-details-eyebrow">
                CASE MANAGEMENT
              </span>

              <h1>Case {caseData.caseId}</h1>

              <p>
                Pathology case record, diagnostic workflow, and laboratory
                processing status.
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/tat/${caseData.caseId}`}
          className="case-details-tat-button"
        >
          <Clock3 size={15} />
          View TAT
        </Link>
      </header>

      {/* =====================================================
          CASE OVERVIEW
          ===================================================== */}

      <section className="case-details-overview">
  <div className="case-details-overview-main">
    <div className="case-details-case-icon">
      <BriefcaseMedical size={24} />
    </div>

    <div className="case-details-overview-identity">
      <span className="case-details-label">CASE ID</span>

      <div className="case-details-overview-id-row">
        <h2>{caseData.caseId}</h2>

        <span className="case-details-overview-type">
          {caseData.caseType || "Pathology Case"}
        </span>
      </div>

      <p>
        Laboratory case record
        <span className="case-details-overview-separator">•</span>
        Diagnostic workflow
      </p>
    </div>
  </div>

  <div className="case-details-overview-status">
    <div className="case-details-overview-status-item">
      <span className="case-details-overview-status-label">
        PRIORITY
      </span>

      <span className={priorityClass}>
        {priority}
      </span>
    </div>

    <div className="case-details-overview-divider" />

    <div className="case-details-overview-status-item">
      <span className="case-details-overview-status-label">
        STATUS
      </span>

      <span className={statusClass}>
        {status.replaceAll("_", " ")}
      </span>
    </div>
  </div>
</section>

      {/* =====================================================
          CASE INFORMATION
          ===================================================== */}

      <section className="case-details-grid">
        <div className="case-details-info-card">
          <div className="case-details-card-heading">
            <div className="case-details-card-icon">
              <User size={17} />
            </div>

            <div>
              <h2>Patient Information</h2>
              <p>Patient associated with this case.</p>
            </div>
          </div>

          <div className="case-details-info-row">
            <span>Patient</span>

            <strong>
              {caseData.patient?.name || caseData.patient || "-"}
            </strong>
          </div>
        </div>

        <div className="case-details-info-card">
          <div className="case-details-card-heading">
            <div className="case-details-card-icon">
              <Stethoscope size={17} />
            </div>

            <div>
              <h2>Doctor Information</h2>
              <p>Referring doctor for this case.</p>
            </div>
          </div>

          <div className="case-details-info-row">
            <span>Doctor</span>

            <strong>
              {caseData.doctor?.name || caseData.doctor || "-"}
            </strong>
          </div>
        </div>
      </section>

      <CaseInformation caseData={caseData} />

      <CaseProcessingSummary
        specimens={specimens}
        blocks={blocks}
        slides={slides}
        workflowEvents={workflowEvents}
      />

      <CaseWorkflow
        caseId={caseData._id}
        specimenId={specimens[0]?._id}
        blockId={blocks[0]?._id}
        slideId={slides[0]?._id}
        workflowEvents={workflowEvents}
        onWorkflowUpdated={loadWorkflow}
      />
    </div>
  );
};

export default CaseDetails;