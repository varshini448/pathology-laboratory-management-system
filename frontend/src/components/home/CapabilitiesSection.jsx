const capabilities = [
  {
    number: "01",
    title: "Specimen Management",
    description:
      "Register, receive, label, and track specimens throughout the laboratory workflow.",
  },
  {
    number: "02",
    title: "Slide Traceability",
    description:
      "Connect cases, blocks, slides, staining, scanning, and review stages in one workflow.",
  },
  {
    number: "03",
    title: "Pathology Reporting",
    description:
      "Create, review, amend, and securely sign out pathology reports.",
  },
  {
    number: "04",
    title: "Quality Assurance",
    description:
      "Manage QC records, review requirements, and quality-related workflow decisions.",
  },
  {
    number: "05",
    title: "TAT Monitoring",
    description:
      "Monitor turnaround time and identify cases that may require attention.",
  },
];

const CapabilitiesSection = () => {
  return (
    <section id="platform" className="home-section home-capabilities">
      <div className="home-container">
        <div className="home-section-heading">
          <span className="home-eyebrow">Core capabilities</span>

          <h2>
            One platform for connected
            <span> laboratory operations.</span>
          </h2>

          <p>
            Pathology LIS brings the key stages of laboratory case management
            together while keeping each workflow traceable and controlled.
          </p>
        </div>

        <div className="home-capabilities-grid">
          {capabilities.map((capability) => (
            <article
              key={capability.number}
              className="home-capability-card"
            >
              <span className="home-capability-number">
                {capability.number}
              </span>

              <div>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
