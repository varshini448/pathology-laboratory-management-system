const DoctorRegistrationFields = ({
  formData,
  handleChange,
}) => {
  return (
    <>
      <section className="registration-section">

        <div className="registration-section-header">
          <h2>Professional Information</h2>

          <p>
            Provide your professional details for verification.
          </p>
        </div>

        <div className="form-grid">

          <div className="form-group">
            <label htmlFor="name">
              Full Name *
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Dr. Full Name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Official Email *
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="doctor@hospital.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Mobile Number *
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+919876543210"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="medicalRegistrationId">
              Medical Registration ID *
            </label>

            <input
              id="medicalRegistrationId"
              name="medicalRegistrationId"
              type="text"
              value={formData.medicalRegistrationId}
              onChange={handleChange}
              placeholder="Enter registration number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="registrationAuthority">
              Registration Authority *
            </label>

            <input
              id="registrationAuthority"
              name="registrationAuthority"
              type="text"
              value={formData.registrationAuthority}
              onChange={handleChange}
              placeholder="Medical Council / Authority"
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
              value={formData.qualification}
              onChange={handleChange}
              placeholder="e.g. MBBS, MD Pathology"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="specialization">
              Specialization *
            </label>

            <input
              id="specialization"
              name="specialization"
              type="text"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="e.g. Oncology"
              required
            />
          </div>

        </div>

      </section>

      <section className="registration-section">

        <div className="registration-section-header">
          <h2>Hospital / Clinic</h2>

          <p>
            Tell us where you practice.
          </p>
        </div>

        <div className="form-grid">

          <div className="form-group">
            <label htmlFor="hospitalName">
              Hospital / Clinic Name *
            </label>

            <input
              id="hospitalName"
              name="hospitalName"
              type="text"
              value={formData.hospitalName}
              onChange={handleChange}
              placeholder="Hospital or clinic name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="hospitalAddress">
              Hospital / Clinic Address
            </label>

            <input
              id="hospitalAddress"
              name="hospitalAddress"
              type="text"
              value={formData.hospitalAddress}
              onChange={handleChange}
              placeholder="Hospital or clinic address"
            />
          </div>

        </div>

      </section>

      <section className="registration-section">

        <div className="registration-section-header">
          <h2>Account Security</h2>

          <p>
            Create a secure password for your doctor account.
          </p>
        </div>

        <div className="form-grid">

          <div className="form-group">
            <label htmlFor="password">
              Password *
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password *
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              required
            />
          </div>

        </div>

      </section>
    </>
  );
};

export default DoctorRegistrationFields;