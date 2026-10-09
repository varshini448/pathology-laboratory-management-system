import React from "react";
import {
  AlertCircle,
  LoaderCircle,
  UserPlus,
} from "lucide-react";

import AddUserPersonalInfo from "./components/AddUserPersonalInfo";
import AddUserRoleDetails from "./components/AddUserRoleDetails";
import AddUserSecurity from "./components/AddUserSecurity";

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

      <AddUserPersonalInfo
        formData={formData}
        handleChange={handleChange}
      />

      <AddUserRoleDetails
        formData={formData}
        roleOptions={roleOptions}
        selectedRole={selectedRole}
        handleChange={handleChange}
        handleRoleChange={handleRoleChange}
      />

      <AddUserSecurity
        formData={formData}
        handleChange={handleChange}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        setShowPassword={setShowPassword}
        setShowConfirmPassword={setShowConfirmPassword}
      />

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
