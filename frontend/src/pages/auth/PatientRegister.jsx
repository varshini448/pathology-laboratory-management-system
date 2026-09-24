import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PatientRegistrationFields from "./external/PatientRegistrationFields";

const PatientRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    abhaId: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Full name is required.";
    }

    if (!formData.dateOfBirth) {
      return "Date of birth is required.";
    }

    if (!formData.gender) {
      return "Please select your gender.";
    }

    if (!formData.phone.trim()) {
      return "Mobile number is required.";
    }

    const phonePattern = /^\+91[6-9]\d{9}$/;

    if (!phonePattern.test(formData.phone.trim())) {
      return "Enter a valid Indian mobile number, for example +919876543210.";
    }

    if (!formData.password) {
      return "Password is required.";
    }

    if (formData.password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      /*
       * Backend patient authentication will be connected
       * in the next authentication step.
       *
       * For now we validate the complete frontend form.
       */

      console.log("Patient registration data:", formData);

      setSuccess(
        "Patient registration form completed successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Patient registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container patient-register-container">

        <div className="auth-header">
          <h1>Patient Registration</h1>

          <p>
            Create your patient account to access your laboratory
            information and finalized reports.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <PatientRegistrationFields
            formData={formData}
            handleChange={handleChange}
          />

          {error && (
            <div className="auth-message error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-message success">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Patient Account"}
          </button>

        </form>

        <div className="auth-footer">

          <p>
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>

          <Link to="/register" className="back-home-link">
            ← Back to Registration Options
          </Link>

        </div>

      </div>
    </div>
  );
};

export default PatientRegister;