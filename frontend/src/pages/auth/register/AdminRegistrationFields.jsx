const AdminRegistrationFields = ({
  profile,
  handleProfileChange,
}) => {
  return (
    <section className="registration-section">

      <div className="registration-section-header">
        <h2>Administrator Details</h2>

        <p>
          Administrator accounts can only be created or approved
          through authorized system administration.
        </p>
      </div>

      <div className="form-grid">

        <div className="form-group">
          <label htmlFor="employeeId">
            Admin / Employee ID *
          </label>

          <input
            id="employeeId"
            name="employeeId"
            type="text"
            value={profile.employeeId}
            onChange={handleProfileChange}
            placeholder="Enter administrator ID"
          />
        </div>

        <div className="form-group">
          <label htmlFor="designation">
            Designation
          </label>

          <input
            id="designation"
            name="designation"
            type="text"
            value={profile.designation || ""}
            onChange={handleProfileChange}
            placeholder="System Administrator"
          />
        </div>

      </div>

    </section>
  );
};

export default AdminRegistrationFields;