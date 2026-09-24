const QualityManagerRegistrationFields = ({
  profile,
  handleProfileChange,
}) => {
  return (
    <section className="registration-section">

      <div className="registration-section-header">
        <h2>Quality Manager Details</h2>

        <p>
          Provide the information required for QA/QC responsibilities.
        </p>
      </div>

      <div className="form-grid">

        <div className="form-group">
          <label htmlFor="employeeId">
            Employee ID *
          </label>

          <input
            id="employeeId"
            name="employeeId"
            type="text"
            value={profile.employeeId}
            onChange={handleProfileChange}
            placeholder="Enter employee ID"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="qualification">
            Qualification *
          </label>

          <input
            id="qualification"
            name="qualification"
            type="text"
            value={profile.qualification}
            onChange={handleProfileChange}
            placeholder="e.g. M.Sc. Biotechnology"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="certification">
            Quality Certification
          </label>

          <input
            id="certification"
            name="certification"
            type="text"
            value={profile.certification}
            onChange={handleProfileChange}
            placeholder="e.g. ISO 15189"
          />
        </div>

        <div className="form-group">
          <label htmlFor="auditResponsibility">
            Audit Responsibility
          </label>

          <input
            id="auditResponsibility"
            name="auditResponsibility"
            type="text"
            value={profile.auditResponsibility}
            onChange={handleProfileChange}
            placeholder="e.g. Internal QA Audits"
          />
        </div>

      </div>
    </section>
  );
};

export default QualityManagerRegistrationFields;