import { Link } from "react-router-dom";

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
            <Link to="/login" className="home-primary-button">
              Open Laboratory Portal
            </Link>

            <a href="#workflow" className="home-secondary-button">
              Explore Workflow
            </a>
          </div>

          <div className="home-hero-note">
            <span className="home-status-dot" />
            Built for controlled, traceable laboratory workflows
          </div>
        </div>

        <div
          className="home-dashboard-preview"
          aria-label="Laboratory workflow preview"
        >
          <div className="home-preview-header">
            <div>
              <span className="home-preview-label">
                LABORATORY WORKFLOW
              </span>
              <h2>Workflow Overview</h2>
            </div>

            <span className="home-preview-status">
              Product Preview
            </span>
          </div>

          <div className="home-preview-stats">
            <div className="home-preview-stat">
              <span>Specimen Management</span>
              <strong>Traceable</strong>
            </div>

            <div className="home-preview-stat">
              <span>Reporting</span>
              <strong>Controlled</strong>
            </div>

            <div className="home-preview-stat">
              <span>Quality Control</span>
              <strong>Auditable</strong>
            </div>

            <div className="home-preview-stat">
              <span>TAT Monitoring</span>
              <strong className="on-track">Tracked</strong>
            </div>
          </div>

          <div className="home-preview-workflow">
            <div className="home-preview-section-header">
              <span>End-to-End Workflow</span>
              <span>Overview</span>
            </div>

            <div className="home-workflow-track">
              <div className="home-workflow-step completed">
                <span>01</span>
                <strong>Collection</strong>
              </div>

              <div className="home-workflow-line active" />

              <div className="home-workflow-step active">
                <span>02</span>
                <strong>Accessioning</strong>
              </div>

              <div className="home-workflow-line" />

              <div className="home-workflow-step">
                <span>03</span>
                <strong>Processing</strong>
              </div>

              <div className="home-workflow-line" />

              <div className="home-workflow-step">
                <span>04</span>
                <strong>Review</strong>
              </div>

              <div className="home-workflow-line" />

              <div className="home-workflow-step">
                <span>05</span>
                <strong>QA</strong>
              </div>

              <div className="home-workflow-line" />

              <div className="home-workflow-step">
                <span>06</span>
                <strong>Report</strong>
              </div>
            </div>
          </div>

          <div className="home-preview-footer">
            <span>Workflow visibility</span>
            <strong>Specimen-to-report traceability</strong>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
