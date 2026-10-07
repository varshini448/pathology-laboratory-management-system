const HeroSection = () => {
  return (
    <section className="home-hero">
      <div className="home-container home-hero-grid">
        <div className="home-hero-content">
          <span className="home-eyebrow">
            Intelligent Pathology Workflow Management
          </span>

          <h1>
            Smarter pathology workflow.
            <span> Clearer laboratory operations.</span>
          </h1>

          <p className="home-hero-description">
            Connect patients, specimens, slides, reporting, quality control,
            and turnaround-time monitoring through one secure laboratory
            information system.
          </p>

          <div className="home-hero-actions">
            <a href="#platform" className="home-primary-button">
              Open Laboratory Portal
            </a>

            <a href="#workflow" className="home-secondary-button">
              Explore Workflow
            </a>
          </div>

          <div className="home-hero-note">
            <span className="home-status-dot" />
            Built for controlled, traceable laboratory workflows
          </div>
        </div>

        <div className="home-dashboard-preview" aria-label="Laboratory dashboard preview">
          <div className="home-preview-header">
            <div>
              <span className="home-preview-label">LABORATORY OVERVIEW</span>
              <h2>Today's operations</h2>
            </div>

            <span className="home-preview-status">Demo Preview</span>
          </div>

          <div className="home-preview-stats">
            <div className="home-preview-stat">
              <span>Active Cases</span>
              <strong>128</strong>
            </div>

            <div className="home-preview-stat">
              <span>Pending Reports</span>
              <strong>24</strong>
            </div>

            <div className="home-preview-stat">
              <span>QA Reviews</span>
              <strong>12</strong>
            </div>

            <div className="home-preview-stat">
              <span>TAT Status</span>
              <strong className="on-track">On Track</strong>
            </div>
          </div>

          <div className="home-preview-workflow">
            <div className="home-preview-section-header">
              <span>Current Workflow</span>
              <span>Live View</span>
            </div>

            <div className="home-workflow-track">
              <div className="home-workflow-step completed">
                <span>01</span>
                <strong>Received</strong>
              </div>

              <div className="home-workflow-line active" />

              <div className="home-workflow-step active">
                <span>02</span>
                <strong>Processing</strong>
              </div>

              <div className="home-workflow-line" />

              <div className="home-workflow-step">
                <span>03</span>
                <strong>Review</strong>
              </div>

              <div className="home-workflow-line" />

              <div className="home-workflow-step">
                <span>04</span>
                <strong>Report</strong>
              </div>
            </div>
          </div>

          <div className="home-preview-footer">
            <span>Workflow visibility</span>
            <strong>End-to-end case tracking</strong>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
