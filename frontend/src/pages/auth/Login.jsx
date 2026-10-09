import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

import "../../styles/auth.css";
import "../../styles/login.css";
import {
  loginUser,
  loginPatient,
  loginDoctor,
} from "../../services/authService";

import LoginBrandPanel from "./login/LoginBrandPanel";
import LoginAccountSelector from "./login/LoginAccountSelector";
import LoginFields from "./login/LoginFields";
import LoginOptions from "./login/LoginOptions";
import LoginMessages from "./login/LoginMessages";
import LoginCaptcha from "./login/LoginCaptcha";

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
  const [captcha, setCaptcha] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0);

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

    if (!captcha.trim()) {
      return "CAPTCHA is required."; 
    }

    if (captcha.trim().toUpperCase() !== captchaValue) {
      return "Invalid CAPTCHA. Please try again."; 
    
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
          navigate("/patient-dashboard");
        } else {
          response = await loginDoctor(loginData);
          navigate("/doctor-dashboard");
        }
      }
    } catch (err) {
      setError(err.message || "Login failed.");
      setCaptcha("");
      setCaptchaRefreshKey((previousKey) => previousKey + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-page">
      <div className="login-shell">

        <LoginBrandPanel />

        {/* RIGHT LOGIN PANEL */}
        <section className="login-form-panel">

          <div className="login-form-header">
            <span className="login-welcome">WELCOME BACK</span>

            <h2>Sign in to your account</h2>

            <p>
              Enter your credentials to continue to the laboratory
              management system.
            </p>
          </div>

          <LoginAccountSelector
            accountType={accountType}
            externalUserType={externalUserType}
            onAccountTypeChange={handleAccountTypeChange}
            onExternalUserTypeChange={(type) => {
              setExternalUserType(type);
              setError("");
            }}
          />

          <form
            onSubmit={handleSubmit}
            className="professional-login-form"
          >
            <LoginFields
              identifier={formData.identifier}
              password={formData.password}
              handleChange={handleChange}
            />

            <LoginOptions
              rememberMe={rememberMe}
              handleRememberMe={handleRememberMe}
            />

            <LoginCaptcha
              key={captchaRefreshKey}
              value={captcha}
              onChange={setCaptcha}
              onCaptchaChange={setCaptchaValue}
            />

            <LoginMessages error={error} />

            <button
              type="submit"
              className="professional-login-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="login-register-link">
            <span>Don't have an account?</span>{" "}
            <Link to="/register">Create an account</Link>
          </div>

          <Link to="/" className="login-back-home">
            <ArrowLeft size={16} />
            Back to home
          </Link>

        </section>
      </div>
    </div>
  );
};

export default Login;
