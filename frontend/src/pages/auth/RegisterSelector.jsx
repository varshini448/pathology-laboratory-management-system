import { Link, useNavigate } from "react-router-dom";
import { UserRound, Stethoscope, ShieldCheck, ArrowLeft } from "lucide-react";

import "../../styles/auth.css";
import "../../styles/register.css";

const RegisterSelector = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page register-page">
      <div className="register-shell">

        <div className="register-header">
          <span className="register-eyebrow">
            PATHOLOGY LIS
          </span>

          <h1>Create an Account</h1>

          <p>
            Choose the account type that matches your role in the
            pathology laboratory system.
          </p>
        </div>

        <div className="registration-options">

          <button
            type="button"
            className="registration-option"
            onClick={() => navigate("/register/internal")}
          >
            <div className="registration-option-icon">
              <ShieldCheck size={27} />
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

          <button
            type="button"
            className="registration-option"
            onClick={() => navigate("/register/patient")}
          >
            <div className="registration-option-icon">
              <UserRound size={27} />
            </div>

            <div className="registration-option-content">
              <h2>Patient</h2>

              <p>
                Create an account to access your laboratory information
                and finalized pathology reports.
              </p>

              <span>
                Personal information • Reports • Consent
              </span>
            </div>
          </button>

          <button
            type="button"
            className="registration-option"
            onClick={() => navigate("/register/doctor")}
          >
            <div className="registration-option-icon">
              <Stethoscope size={27} />
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

        <div className="register-footer">
          <div>
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </div>

          <Link to="/" className="register-back-home">
            <ArrowLeft size={15} />
            Back to home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterSelector;