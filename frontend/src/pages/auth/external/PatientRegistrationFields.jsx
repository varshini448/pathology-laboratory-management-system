const PatientRegistrationFields = ({
  formData,
  handleChange,
}) => {
  return (
    <>
      <section className="registration-section">

        <div className="registration-section-header">
          <h2>Personal Information</h2>

          <p>
            Enter your basic information for your patient account.
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
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">
              Date of Birth *
            </label>

            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">
              Gender *
            </label>

            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">
                Select gender
              </option>

              <option value="MALE">
                Male
              </option>

              <option value="FEMALE">
                Female
              </option>

              <option value="OTHER">
                Other
              </option>

              <option value="PREFER_NOT_TO_SAY">
                Prefer not to say
              </option>
            </select>
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
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="patient@example.com"
            />
          </div>

        </div>

        <div className="form-group">
          <label htmlFor="address">
            Address
          </label>

          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            rows="3"
          />
        </div>

      </section>

      <section className="registration-section">

        <div className="registration-section-header">
          <h2>ABHA Information</h2>

          <p>
            ABHA ID is optional for this prototype.
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="abhaId">
            ABHA ID
          </label>

          <input
            id="abhaId"
            name="abhaId"
            type="text"
            value={formData.abhaId}
            onChange={handleChange}
            placeholder="Enter ABHA ID if available"
          />
        </div>

      </section>

      <section className="registration-section">

        <div className="registration-section-header">
          <h2>Account Security</h2>

          <p>
            Create a secure password for your patient account.
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

export default PatientRegistrationFields;