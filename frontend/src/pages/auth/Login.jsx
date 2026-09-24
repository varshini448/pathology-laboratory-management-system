import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  loginUser,
  loginPatient,
  loginDoctor,
} from "../../services/authService";

import LoginFields from "./login/LoginFields";
import LoginOptions from "./login/LoginOptions";
import LoginMessages from "./login/LoginMessages";

const Login = () => {
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState("internal");
  const [externalUserType, setExternalUserType] = useState("patient");

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setError("");

    setFormData({
      identifier: "",
      password: "",
    });
  };

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
  };

  const validateForm = () => {
    if (!formData.identifier.trim()) {
      return accountType === "internal"
        ? "Email or Employee/Medical ID is required."
        : "Email, mobile number, Patient ID or Doctor ID is required.";
    }

    if (!formData.password) {
      return "Password is required.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      let response;

      if (accountType === "internal") {
        response = await loginUser({
          identifier: formData.identifier.trim(),
          password: formData.password,
          accountType: "internal",
          rememberMe,
        });

        const role = response?.user?.role;

        switch (role) {
          case "ADMIN":
            navigate("/admin-dashboard");
            break;

          case "TECHNICIAN":
            navigate("/technician-dashboard");
            break;

          case "PATHOLOGIST":
            navigate("/pathologist-dashboard");
            break;

          case "QUALITY_MANAGER":
            navigate("/quality-dashboard");
            break;

          default:
            navigate("/dashboard");
        }
      } else {
        const loginData = {
          identifier: formData.identifier.trim(),
          password: formData.password,
        };

        if (externalUserType === "patient") {
          response = await loginPatient(loginData);

          navigate("/patient");
        } else {
          response = await loginDoctor(loginData);

          navigate("/doctor");
        }
      }
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container login-container">
        <div className="auth-header">
          <h1>Login</h1>

          <p>
            Access the Pathology Laboratory Management System
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
            onClick={() => handleAccountTypeChange("internal")}
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
            onClick={() => handleAccountTypeChange("external")}
          >
            Patient / Doctor
          </button>
        </div>

        <div className="login-account-info">
          {accountType === "internal" ? (
            <>
              <h2>Internal User Login</h2>

              <p>
                For administrators, technicians, pathologists and
                quality managers.
              </p>
            </>
          ) : (
            <>
              <h2>Patient / Doctor Login</h2>

              <p>
                Login using your registered patient or doctor account.
              </p>

              <div className="account-type-selector">
                <button
                  type="button"
                  className={
                    externalUserType === "patient"
                      ? "account-type-button active"
                      : "account-type-button"
                  }
                  onClick={() => {
                    setExternalUserType("patient");
                    setError("");
                  }}
                >
                  Patient
                </button>

                <button
                  type="button"
                  className={
                    externalUserType === "doctor"
                      ? "account-type-button active"
                      : "account-type-button"
                  }
                  onClick={() => {
                    setExternalUserType("doctor");
                    setError("");
                  }}
                >
                  Doctor
                </button>
              </div>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <LoginFields
            identifier={formData.identifier}
            password={formData.password}
            handleChange={handleChange}
          />

          <LoginOptions
            rememberMe={rememberMe}
            handleRememberMe={handleRememberMe}
          />

          <LoginMessages error={error} />

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register">Create an account</Link>
          </p>

          <Link to="/" className="back-home-link">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
