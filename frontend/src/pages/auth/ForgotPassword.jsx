import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [accountType, setAccountType] = useState("internal");

  const [identifier, setIdentifier] = useState("");

  const [error, setError] = useState("");

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setIdentifier("");
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!identifier.trim()) {
      setError(
        accountType === "internal"
          ? "Please enter your email or employee/medical ID."
          : "Please enter your email or mobile number."
      );
      return;
    }

    setError(
      "Password reset delivery is not configured. Please contact your system administrator."
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-header">
          <h1>Forgot Password</h1>
          <p>
            Enter your account information to reset your password.
          </p>
        </div>

        <div className="account-type-selector">

          <button
            type="button"
            className={
              accountType === "internal"
                ? "account-type-button active"
                : "account-type-button"
            }
            onClick={() =>
              handleAccountTypeChange("internal")
            }
          >
            Internal User
          </button>

          <button
            type="button"
            className={
              accountType === "external"
                ? "account-type-button active"
                : "account-type-button"
            }
            onClick={() =>
              handleAccountTypeChange("external")
            }
          >
            Patient / Doctor
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >

          <div className="form-group">

            <label htmlFor="identifier">
              {accountType === "internal"
                ? "Email or Employee/Medical ID"
                : "Email or Mobile Number"}
            </label>

            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) =>
                setIdentifier(e.target.value)
              }
              placeholder={
                accountType === "internal"
                  ? "Enter email or ID"
                  : "Enter email or mobile number"
              }
              required
            />

          </div>

          {error && (
            <div className="login-message error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
          >
            Send Reset Instructions
          </button>

        </form>

        <div className="auth-footer">
          <Link to="/login">
            ← Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
