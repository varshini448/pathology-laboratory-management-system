const operationalCapabilities = [
  {
    title: "Turnaround monitoring",
    description:
      "Review elapsed time based on recorded case and workflow events.",
  },
  {
    title: "Workflow traceability",
    description:
      "Follow specimen, block, and slide progression through laboratory stages.",
  },
  {
    title: "Quality review",
    description:
      "Record slide checks and corrective actions for staff review.",
  },
];

const AISection = () => {
  return (
    <section id="operational-insight" className="home-section home-ai">
      <div className="home-container">
        <div className="home-ai-panel">
          <div className="home-ai-intro">
            <span className="home-ai-badge">
              Operational oversight
            </span>

            <span className="home-eyebrow">Workflow visibility</span>

            <h2>
              Clear operational signals,
              <span> with professionals in control.</span>
            </h2>

            <p>
              Use recorded workflow events, turnaround-time views, and quality
              checks to understand current laboratory operations.
            </p>

            <p className="home-ai-disclaimer">
              Predictive AI is not connected in this build. Qualified
              laboratory professionals remain responsible for review and final
              clinical decisions.
            </p>
          </div>

          <div className="home-ai-grid">
            {operationalCapabilities.map((capability, index) => (
              <article className="home-ai-card" key={capability.title}>
                <span className="home-ai-card-number">
                  0{index + 1}
                </span>

                <h3>{capability.title}</h3>

                <p>{capability.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;
