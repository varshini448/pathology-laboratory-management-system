const CommonRegistrationFields = ({
  formData,
  handleChange,
}) => {
  return (
    <>
      <div className="form-group">
        <label htmlFor="name">Full Name</label>

        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>

        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>

        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">
          Confirm Password
        </label>

        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>

        <input
          id="phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+919876543210"
          required
        />

        <small>
          Enter an Indian phone number in +91XXXXXXXXXX format.
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="department">Department</label>

        <input
          id="department"
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="Enter your department"
          required
        />
      </div>
    </>
  );
};

export default CommonRegistrationFields;