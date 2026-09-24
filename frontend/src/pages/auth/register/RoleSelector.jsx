const RoleSelector = ({ role, handleChange }) => {
  return (
    <section className="registration-section">
      <div className="registration-section-header">
        <h2>Staff Role</h2>
        <p>Select the professional role you are registering for.</p>
      </div>

      <div className="form-group">
        <label htmlFor="role">
          Role *
        </label>

        <select
          id="role"
          name="role"
          value={role}
          onChange={handleChange}
          required
        >
          <option value="">Select your role</option>

          <option value="TECHNICIAN">
            Technician
          </option>

          <option value="PATHOLOGIST">
            Pathologist
          </option>

          <option value="QUALITY_MANAGER">
            Quality Manager
          </option>
        </select>
      </div>

      <div className="registration-info">
        <strong>Administrator approval required</strong>

        <p>
          Staff accounts must be reviewed and approved by an
          authorized administrator before system access is granted.
        </p>
      </div>
    </section>
  );
};

export default RoleSelector;