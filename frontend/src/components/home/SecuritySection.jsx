const securityItems = [
  {
    number: "01",
    title: "Role-based access",
    description:
      "Access is organized around laboratory responsibilities so users see the workflows and information relevant to their role.",
  },
  {
    number: "02",
    title: "Audit history",
    description:
      "Important workflow actions can be traced through an organized history of laboratory activity.",
  },
  {
    number: "03",
    title: "Chain of custody",
    description:
      "Specimen, block, and slide progression remains connected across the laboratory workflow.",
  },
  {
    number: "04",
    title: "Controlled sharing",
    description:
      "Case and report information is exposed through controlled access rather than unrestricted sharing.",
  },
];

const SecuritySection = () => {
  return (
    <section className="home-security" id="security">
      <div className="home-container">
        <div className="home-security-layout">
          <div className="home-security-intro">
            <span className="home-eyebrow">Security & traceability</span>

            <h2>
              Keep every case
              <span> accountable.</span>
            </h2>

            <p>
              Laboratory information should remain connected, controlled, and
              traceable throughout the specimen-to-report journey.
            </p>
          </div>

          <div className="home-security-list">
            {securityItems.map((item) => (
              <article className="home-security-item" key={item.number}>
                <span className="home-security-number">{item.number}</span>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
