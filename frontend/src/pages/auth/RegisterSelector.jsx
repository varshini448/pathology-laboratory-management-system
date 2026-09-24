import { Link, useNavigate } from "react-router-dom";

const RegisterSelector = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-container register-selector-container">

        <div className="auth-header">
          <h1>Create an Account</h1>
          <p>
            Choose the type of account you want to create.
          </p>
        </div>

        <div className="registration-options">

          {/* Internal Staff */}
          <button
            type="button"
            className="registration-option"
            onClick={() => navigate("/register/internal")}
          >
            <div className="registration-option-icon">
              👨‍⚕️
            </div>

            <div className="registration-option-content">
              <h2>Staff Member</h2>

              <p>
                For laboratory employees and healthcare professionals
                working inside the pathology laboratory.
              </p>

              <span>
                Technician • Pathologist • Quality Manager
              </span>
            </div>
          </button>

          {/* Patient */}
          <button
            type="button"
            className="registration-option"
            onClick={() => navigate("/register/patient")}
          >
            <div className="registration-option-icon">
              🧑‍🦱
            </div>

            <div className="registration-option-content">
              <h2>Patient</h2>

              <p>
                Create an account to access your laboratory information
                and finalized pathology reports.
              </p>

              <span>
                Personal health information • Reports • Consent
              </span>
            </div>
          </button>

          {/* Doctor */}
          <button
            type="button"
            className="registration-option"
            onClick={() => navigate("/register/doctor")}
          >
            <div className="registration-option-icon">
              🩺
            </div>

            <div className="registration-option-content">
              <h2>Doctor</h2>

              <p>
                Register as a referring healthcare professional to
                access authorized patient laboratory reports.
              </p>

              <span>
                Professional verification required
              </span>
            </div>
          </button>

        </div>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>

          <Link to="/" className="back-home-link">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterSelector;