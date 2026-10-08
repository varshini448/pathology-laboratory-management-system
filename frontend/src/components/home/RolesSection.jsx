const roles = [
  {
    number: "01",
    title: "Laboratory Technician",
    description:
      "Manage specimen handling, accessioning, processing, and workflow updates with clear traceability.",
  },
  {
    number: "02",
    title: "Pathologist",
    description:
      "Review cases, evaluate findings, manage reports, and complete controlled sign-out workflows.",
  },
  {
    number: "03",
    title: "Quality Manager",
    description:
      "Monitor quality activities, review exceptions, and maintain audit-ready laboratory processes.",
  },
  {
    number: "04",
    title: "Administrator",
    description:
      "Manage users, access permissions, laboratory configuration, and system-level operations.",
  },
  {
    number: "05",
    title: "Doctor",
    description:
      "Access appropriate case and report information through controlled external workflows.",
  },
  {
    number: "06",
    title: "Patient",
    description:
      "Access permitted information through a secure, role-aware patient experience.",
  },
];

const RolesSection = () => {
  return (
    <section className="home-roles" id="roles">
      <div className="home-container">
        <div className="home-section-heading">
          <span className="home-eyebrow">Role-aware laboratory access</span>

          <h2>
            One platform.
            <span> Different responsibilities.</span>
          </h2>

          <p>
            The platform organizes laboratory operations around the people
            responsible for each stage of the pathology workflow.
          </p>
        </div>

        <div className="home-roles-grid">
          {roles.map((role) => (
            <article className="home-role-card" key={role.number}>
              <span className="home-role-number">{role.number}</span>

              <div>
                <h3>{role.title}</h3>
                <p>{role.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RolesSection;
