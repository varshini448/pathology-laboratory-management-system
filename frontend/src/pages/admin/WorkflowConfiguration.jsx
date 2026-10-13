import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Info,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import "./workflow-configuration.css";

const WORKFLOW_STAGES = [
  {
    name: "Specimen collection",
    description: "Record the collection of the patient specimen.",
    group: "SPECIMEN HANDLING",
  },
  {
    name: "Accessioning",
    description: "Receive and register the specimen for laboratory processing.",
    group: "SPECIMEN HANDLING",
  },
  {
    name: "Grossing",
    description: "Document macroscopic examination and tissue preparation.",
    group: "TISSUE PROCESSING",
  },
  {
    name: "Embedding",
    description: "Prepare tissue blocks for sectioning.",
    group: "TISSUE PROCESSING",
  },
  {
    name: "Sectioning",
    description: "Prepare tissue sections for slide processing.",
    group: "SLIDE PREPARATION",
  },
  {
    name: "Staining",
    description: "Apply the required staining method to prepared slides.",
    group: "SLIDE PREPARATION",
  },
  {
    name: "Scanning",
    description: "Scan slides and prepare them for pathologist review.",
    group: "DIGITAL REVIEW",
  },
  {
    name: "Pathologist review",
    description: "Support professional review of the processed case.",
    group: "DIGITAL REVIEW",
  },
];

const WorkflowConfiguration = () => (
  <main className="dashboard-page workflow-config-page">
    <DashboardHeader
      title="Workflow Configuration"
      subtitle="Review the laboratory processing stages and the workflow controls currently supported by the platform."
    />

    <div className="workflow-config-content">
      <section className="workflow-config-banner">
        <div className="workflow-config-banner-icon">
          <Workflow size={24} aria-hidden="true" />
        </div>

        <div className="workflow-config-banner-copy">
          <span className="workflow-config-eyebrow">LABORATORY OPERATIONS</span>
          <h2>Workflow overview</h2>
          <p>
            Follow the configured processing sequence from specimen collection
            through pathologist review.
          </p>
        </div>

        <div className="workflow-config-count">
          <strong>{String(WORKFLOW_STAGES.length).padStart(2, "0")}</strong>
          <span>Defined stages</span>
        </div>
      </section>

      <div className="workflow-config-summary">
        <article className="workflow-config-summary-card">
          <span className="workflow-config-summary-icon">
            <ClipboardList size={20} aria-hidden="true" />
          </span>
          <div>
            <p>Workflow stages</p>
            <strong>{WORKFLOW_STAGES.length} defined</strong>
            <span>Application-defined sequence</span>
          </div>
        </article>

        <article className="workflow-config-summary-card">
          <span className="workflow-config-summary-icon workflow-config-summary-icon--green">
            <ShieldCheck size={20} aria-hidden="true" />
          </span>
          <div>
            <p>Configuration access</p>
            <strong>Read-only</strong>
            <span>No runtime editing available</span>
          </div>
        </article>

        <article className="workflow-config-summary-card">
          <span className="workflow-config-summary-icon workflow-config-summary-icon--purple">
            <CheckCircle2 size={20} aria-hidden="true" />
          </span>
          <div>
            <p>Workflow tracking</p>
            <strong>Existing actions</strong>
            <span>Transitions handled by workflow logic</span>
          </div>
        </article>
      </div>

      <section
        className="workflow-config-panel"
        aria-labelledby="workflow-config-stages-title"
      >
        <div className="workflow-config-panel-header">
          <div>
            <span className="workflow-config-eyebrow">PROCESS SEQUENCE</span>
            <h2 id="workflow-config-stages-title">Configured workflow stages</h2>
            <p>Review each stage in the current application workflow.</p>
          </div>
          <span className="workflow-config-readonly">
            <ShieldCheck size={14} aria-hidden="true" />
            Read-only
          </span>
        </div>

        <ol className="workflow-config-stage-list">
          {WORKFLOW_STAGES.map((stage, index) => {
            const previousGroup =
              index > 0 ? WORKFLOW_STAGES[index - 1].group : null;
            const showGroup = stage.group !== previousGroup;

            return (
              <li className="workflow-config-stage-item" key={stage.name}>
                {showGroup && (
                  <p className="workflow-config-stage-group">{stage.group}</p>
                )}

                <div className="workflow-config-stage-card">
                  <span className="workflow-config-stage-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="workflow-config-stage-copy">
                    <h3>{stage.name}</h3>
                    <p>{stage.description}</p>
                  </div>

                  <span
                    className="workflow-config-stage-indicator"
                    aria-label="Defined in application"
                    title="Defined in application"
                  >
                    <CheckCircle2 size={18} aria-hidden="true" />
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="workflow-config-note" role="note">
          <Info size={19} aria-hidden="true" />
          <div>
            <strong>Application-defined workflow</strong>
            <p>
              These stages reflect the sequence documented in this page.
              Runtime editing and per-laboratory workflow settings are not
              currently available. Stage indicators identify configured stages;
              they do not represent live case progress.
            </p>
          </div>
        </div>
      </section>

      <footer className="workflow-config-footer">
        <p>
          Changes to workflow behavior must be implemented through the
          application's workflow logic.
        </p>
        <Link to="/admin-dashboard" className="workflow-config-back-link">
          <ArrowLeft size={17} aria-hidden="true" />
          Return to administration
        </Link>
      </footer>
    </div>
  </main>
);

export default WorkflowConfiguration;
