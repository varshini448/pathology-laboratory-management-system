import React from "react";
import {
  UserRound,
  ShieldCheck,
  BriefcaseBusiness,
  Stethoscope,
  ClipboardCheck,
  Eye,
  EyeOff,
  AlertCircle,
  LoaderCircle,
  UserPlus,
} from "lucide-react";

const roleIcons = {
  TECHNICIAN: BriefcaseBusiness,
  PATHOLOGIST: Stethoscope,
  QUALITY_MANAGER: ClipboardCheck,
};

const AddUserForm = ({
  formData,
  roleOptions,
  selectedRole,
  error,
  submitting,
  showPassword,
  showConfirmPassword,
  handleChange,
  handleRoleChange,
  handleSubmit,
  setShowPassword,
  setShowConfirmPassword,
  onCancel,
}) => {
  const RoleIcon = roleIcons[formData.role] || ShieldCheck;

  return (
    <form className="add-user-form" onSubmit={handleSubmit}>
      {error && (
        <div className="add-user-error" role="alert">
          <AlertCircle size={19} />
          <span>{error}</span>
        </div>
      )}

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

      <section className="add-user-card">
        <div className="add-user-section-heading">
          <div className="add-user-section-icon">
            <ShieldCheck size={19} />
          </div>
          <div>
            <h2>Role and credentials</h2>
            <p>Select a role and provide the required professional details.</p>
          </div>
        </div>

        <div className="add-user-role-options">
          {roleOptions.map((option) => {
            const Icon = option.icon;
            const active = formData.role === option.value;

            return (
              <button
                type="button"
                key={option.value}
                className={`add-user-role-option${active ? " is-selected" : ""}`}
                onClick={() => handleRoleChange(option.value)}
                aria-pressed={active}
              >
                <span className="add-user-role-icon">
                  <Icon size={21} />
                </span>
                <span className="add-user-role-copy">
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </span>
                <span className="add-user-role-radio" />
              </button>
            );
          })}
        </div>

        <div className="add-user-role-context">
          <RoleIcon size={18} />
          <span>
            Required credentials for <strong>{selectedRole.label}</strong>
          </span>
        </div>

        <div className="add-user-fields">
          {formData.role !== "PATHOLOGIST" && (
            <div className="add-user-field">
              <label htmlFor="employeeId">Employee ID <span>*</span></label>
              <input
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="e.g. LAB-EMP-001"
                required
              />
            </div>
          )}

          {formData.role === "PATHOLOGIST" && (
            <div className="add-user-field">
              <label htmlFor="medicalRegistrationId">
                Medical registration ID <span>*</span>
              </label>
              <input
                id="medicalRegistrationId"
                name="medicalRegistrationId"
                value={formData.medicalRegistrationId}
                onChange={handleChange}
                placeholder="Enter registration ID"
                required
              />
            </div>
          )}

          <div className="add-user-field">
            <label htmlFor="qualification">Qualification <span>*</span></label>
            <input
              id="qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="e.g. B.Sc. Medical Laboratory Technology"
              required
            />
          </div>

          {formData.role === "PATHOLOGIST" && (
            <div className="add-user-field add-user-field-full">
              <label htmlFor="specialization">Specialization <span>*</span></label>
              <input
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g. Histopathology"
                required
              />
            </div>
          )}
        </div>
      </section>

      <section className="add-user-card">
        <div className="add-user-section-heading">
          <div className="add-user-section-icon">
            <ShieldCheck size={19} />
          </div>
          <div>
            <h2>Account security</h2>
            <p>Set an initial password for the staff account.</p>
          </div>
        </div>

        <div className="add-user-fields">
          <div className="add-user-field">
            <label htmlFor="password">Initial password <span>*</span></label>
            <div className="add-user-password-wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={8}
                required
              />
              <button
                type="button"
                className="add-user-password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <small>Use at least 8 characters.</small>
          </div>

          <div className="add-user-field">
            <label htmlFor="confirmPassword">
              Confirm password <span>*</span>
            </label>
            <div className="add-user-password-wrap">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                autoComplete="new-password"
                minLength={8}
                required
              />
              <button
                type="button"
                className="add-user-password-toggle"
                onClick={() => setShowConfirmPassword((value) => !value)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="add-user-form-footer">
        <p><span>*</span> Required fields</p>
        <div className="add-user-form-actions">
          <button
            type="button"
            className="add-user-button add-user-button-secondary"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="add-user-button add-user-button-primary"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <LoaderCircle className="add-user-spinner" size={18} />
                Submitting...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Submit registration
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddUserForm;
