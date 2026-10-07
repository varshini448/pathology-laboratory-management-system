const aiCapabilities = [
  {
    title: "TAT Risk Prediction",
    description:
      "Identify cases that may exceed their target turnaround time so teams can act earlier.",
  },
  {
    title: "Workflow Intelligence",
    description:
      "Highlight potential processing bottlenecks across laboratory workflow stages.",
  },
  {
    title: "QC Intelligence",
    description:
      "Support quality teams by identifying cases that may require additional review.",
  },
];

const AISection = () => {
  return (
    <section id="ai-assistance" className="home-section home-ai">
      <div className="home-container">
        <div className="home-ai-panel">
          <div className="home-ai-intro">
            <span className="home-ai-badge">
              AI assistance · Human review required
            </span>

            <span className="home-eyebrow">Laboratory intelligence</span>

            <h2>
              Smarter workflow decisions,
              <span> with professionals in control.</span>
            </h2>

            <p>
              AI-assisted insights can help laboratory teams identify potential
              delays, workflow bottlenecks, and cases requiring additional
              quality review.
            </p>

            <p className="home-ai-disclaimer">
              AI provides decision support. Qualified laboratory professionals
              remain responsible for review and final clinical decisions.
            </p>
          </div>

          <div className="home-ai-grid">
            {aiCapabilities.map((capability, index) => (
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
