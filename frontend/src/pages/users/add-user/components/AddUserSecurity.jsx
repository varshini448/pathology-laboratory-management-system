import { ShieldCheck, Eye, EyeOff } from "lucide-react";

const AddUserSecurity = ({
  formData,
  handleChange,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
}) => {
  return (
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
  );
};

export default AddUserSecurity;
