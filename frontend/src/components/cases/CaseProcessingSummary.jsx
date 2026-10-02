import {
  Activity,
  Box,
  Microscope,
  Package,
} from "lucide-react";

const CaseProcessingSummary = ({
  specimens = [],
  blocks = [],
  slides = [],
  workflowEvents = [],
}) => {
  const summaryItems = [
    {
      label: "Specimens",
      value: specimens.length,
      icon: Package,
      description: "Registered specimens",
    },
    {
      label: "Blocks",
      value: blocks.length,
      icon: Box,
      description: "Processing blocks",
    },
    {
      label: "Slides",
      value: slides.length,
      icon: Microscope,
      description: "Prepared slides",
    },
    {
      label: "Workflow Events",
      value: workflowEvents.length,
      icon: Activity,
      description: "Recorded events",
    },
  ];

  return (
    <section className="case-details-card case-processing-card">
      <div className="case-section-header">
        <div className="case-section-icon">
          <Activity size={19} />
        </div>

        <div>
          <span className="case-section-eyebrow">PROCESSING OVERVIEW</span>
          <h2>Case Processing Summary</h2>
          <p>
            Current record counts across the laboratory workflow.
          </p>
        </div>
      </div>

      <div className="case-processing-grid">
        {summaryItems.map((item) => {
          const Icon = item.icon;

          return (
            <div className="case-processing-item" key={item.label}>
              <div className="case-processing-icon">
                <Icon size={20} />
              </div>

              <div className="case-processing-content">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <small>{item.description}</small>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CaseProcessingSummary;