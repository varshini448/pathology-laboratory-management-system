const PathologistRegistrationFields = ({
  profile,
  handleProfileChange,
}) => {
  return (
    <section className="registration-role-section">
      <h3>Pathologist Professional Information</h3>

      <div className="form-group">
        <label htmlFor="medicalRegistrationId">
          Medical Registration ID
        </label>

        <input
          id="medicalRegistrationId"
          type="text"
          name="medicalRegistrationId"
          value={profile.medicalRegistrationId}
          onChange={handleProfileChange}
          placeholder="Enter medical registration ID"
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
          placeholder="e.g. MBBS, MD Pathology"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="specialization">
          Specialization
        </label>

        <input
          id="specialization"
          type="text"
          name="specialization"
          value={profile.specialization}
          onChange={handleProfileChange}
          placeholder="e.g. Histopathology"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="registrationAuthority">
          License Issuing Authority
        </label>

        <input
          id="registrationAuthority"
          type="text"
          name="registrationAuthority"
          value={profile.registrationAuthority}
          onChange={handleProfileChange}
          placeholder="Enter registration authority"
        />
      </div>

      <div className="form-group">
        <label htmlFor="registrationValidUntil">
          Registration Valid Until
        </label>

        <input
          id="registrationValidUntil"
          type="date"
          name="registrationValidUntil"
          value={profile.registrationValidUntil}
          onChange={handleProfileChange}
        />
      </div>
    </section>
  );
};

export default PathologistRegistrationFields;