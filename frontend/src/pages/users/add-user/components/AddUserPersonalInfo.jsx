import { UserRound } from "lucide-react";

const AddUserPersonalInfo = ({ formData, handleChange }) => {
  return (
    <section className="add-user-card">
      <div className="add-user-section-heading">
        <div className="add-user-section-icon">
          <UserRound size={19} />
        </div>
        <div>
          <h2>Personal information</h2>
          <p>Enter the staff member's contact details.</p>
        </div>
      </div>

      <div className="add-user-fields">
        <div className="add-user-field">
          <label htmlFor="name">Full name <span>*</span></label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Priya Sharma"
            autoComplete="name"
            minLength={2}
            required
          />
        </div>

        <div className="add-user-field">
          <label htmlFor="email">Work email <span>*</span></label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@laboratory.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="add-user-field">
          <label htmlFor="phone">Mobile number <span>*</span></label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+919876543210"
            autoComplete="tel"
            pattern="\+91[6-9][0-9]{9}"
            title="Use +91 followed by a valid 10-digit Indian mobile number."
            required
          />
          <small>Use +91 followed by your 10-digit mobile number.</small>
        </div>

        <div className="add-user-field">
          <label htmlFor="department">Department <span>*</span></label>
          <input
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="e.g. Histopathology"
            required
          />
        </div>
      </div>
    </section>
  );
};

export default AddUserPersonalInfo;
