const TechnicianRegistrationFields = ({
  profile,
  handleProfileChange,
}) => {
  return (
    <section className="registration-role-section">
      <h3>Technician Professional Information</h3>

      <div className="form-group">
        <label htmlFor="employeeId">
          Employee ID
        </label>

        <input
          id="employeeId"
          type="text"
          name="employeeId"
          value={profile.employeeId}
          onChange={handleProfileChange}
          placeholder="Enter employee ID"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="qualification">
          Qualification
        </label>

        <input
          id="qualification"
          type="text"
          name="qualification"
          value={profile.qualification}
          onChange={handleProfileChange}
          placeholder="e.g. B.Sc Medical Laboratory Technology"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="assignedShift">
          Assigned Shift
        </label>

        <select
          id="assignedShift"
          name="assignedShift"
          value={profile.assignedShift}
          onChange={handleProfileChange}
        >
          <option value="">
            Select shift
          </option>

          <option value="MORNING">
            Morning
          </option>

          <option value="AFTERNOON">
            Afternoon
          </option>

          <option value="NIGHT">
            Night
          </option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="workstation">
          Assigned Workstation
        </label>

        <input
          id="workstation"
          type="text"
          name="workstation"
          value={profile.workstation}
          onChange={handleProfileChange}
          placeholder="e.g. Histopathology Lab"
        />
      </div>

      <div className="form-group">
        <label htmlFor="certification">
          Certification
        </label>

        <input
          id="certification"
          type="text"
          name="certification"
          value={profile.certification}
          onChange={handleProfileChange}
          placeholder="Enter certification if applicable"
        />
      </div>
    </section>
  );
};

export default TechnicianRegistrationFields;