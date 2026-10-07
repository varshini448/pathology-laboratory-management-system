const workflowSteps = [
  {
    number: "01",
    title: "Collection",
    description: "Specimens are collected and registered for laboratory processing.",
  },
  {
    number: "02",
    title: "Accessioning",
    description: "Cases receive identifiers and enter the controlled laboratory workflow.",
  },
  {
    number: "03",
    title: "Processing",
    description: "Blocks, slides, staining, and processing stages are tracked.",
  },
  {
    number: "04",
    title: "Review",
    description: "Pathologists review cases and associated slide information.",
  },
  {
    number: "05",
    title: "Quality",
    description: "Quality checks and review requirements are completed.",
  },
  {
    number: "06",
    title: "Reporting",
    description: "Reports are finalized through controlled sign-out workflows.",
  },
];

const WorkflowSection = () => {
  return (
    <section id="workflow" className="home-section home-workflow">
      <div className="home-container">
        <div className="home-section-heading home-section-heading-centered">
          <span className="home-eyebrow">Laboratory workflow</span>

          <h2>
            From specimen to
            <span> signed report.</span>
          </h2>

          <p>
            Follow each case through a connected workflow with visibility across
            specimen processing, slide management, quality review, and reporting.
          </p>
        </div>

        <div className="home-workflow-timeline">
          {workflowSteps.map((step, index) => (
            <div className="home-workflow-item" key={step.number}>
              <div className="home-workflow-marker">
                <span>{step.number}</span>
              </div>

              <div className="home-workflow-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>

              {index < workflowSteps.length - 1 && (
                <div className="home-workflow-connector" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
