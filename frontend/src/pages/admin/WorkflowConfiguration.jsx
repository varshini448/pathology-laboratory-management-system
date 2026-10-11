import { Link } from "react-router-dom";
import { ArrowLeft, ClipboardList, Info } from "lucide-react";
import DashboardHeader from "../dashboard/components/DashboardHeader";

const WORKFLOW_STAGES = [
  "Specimen collection",
  "Accessioning",
  "Grossing",
  "Embedding",
  "Sectioning",
  "Staining",
  "Scanning",
  "Pathologist review",
];

const WorkflowConfiguration = () => (
  <main className="dashboard-page">
    <DashboardHeader
      title="Workflow Configuration"
      subtitle="Review the stages currently supported by the laboratory workflow."
    />

    <section className="admin-dashboard-panel" aria-labelledby="workflow-config-title">
      <div className="admin-panel-header">
        <div>
          <span>WORKFLOW</span>
          <h2 id="workflow-config-title">Configured workflow stages</h2>
        </div>
        <ClipboardList size={22} aria-hidden="true" />
      </div>

      <p>
        These stages are defined in the application. Runtime editing and
        per-laboratory workflow settings are not available, so no configuration
        controls are shown here.
      </p>

      <ol>
        {WORKFLOW_STAGES.map((stage) => <li key={stage}>{stage}</li>)}
      </ol>

      <p role="note">
        <Info size={16} aria-hidden="true" /> Status transitions are recorded
        through the existing workflow actions.
      </p>

      <Link to="/cases" className="admin-primary-action">
        <ArrowLeft size={16} /> Return to cases
      </Link>
    </section>
  </main>
);

export default WorkflowConfiguration;
