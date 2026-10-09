import {
  ShieldCheck,
  BriefcaseBusiness,
  Stethoscope,
  ClipboardCheck,
} from "lucide-react";

const roleIcons = {
  TECHNICIAN: BriefcaseBusiness,
  PATHOLOGIST: Stethoscope,
  QUALITY_MANAGER: ClipboardCheck,
};

const AddUserRoleDetails = ({
  formData,
  roleOptions,
  selectedRole,
  handleChange,
  handleRoleChange,
}) => {
  const RoleIcon = roleIcons[formData.role] || ShieldCheck;

  return (
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
            <label htmlFor="specialization">
              Specialization <span>*</span>
            </label>
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
  );
};

export default AddUserRoleDetails;
