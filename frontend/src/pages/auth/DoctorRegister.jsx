import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import DoctorRegistrationFields from "./external/DoctorRegistrationFields";

const DoctorRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    medicalRegistrationId: "",
    registrationAuthority: "",
    qualification: "",
    specialization: "",
    hospitalName: "",
    hospitalAddress: "",
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

    if (!formData.email.trim()) {
      return "Official email is required.";
    }

    if (!formData.phone.trim()) {
      return "Mobile number is required.";
    }

    const phonePattern = /^\+91[6-9]\d{9}$/;

    if (!phonePattern.test(formData.phone.trim())) {
      return "Enter a valid Indian mobile number, for example +919876543210.";
    }

    if (!formData.medicalRegistrationId.trim()) {
      return "Medical Registration ID is required.";
    }

    if (!formData.registrationAuthority.trim()) {
      return "Registration authority is required.";
    }

    if (!formData.qualification.trim()) {
      return "Qualification is required.";
    }

    if (!formData.specialization.trim()) {
      return "Specialization is required.";
    }

    if (!formData.hospitalName.trim()) {
      return "Hospital or clinic name is required.";
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
       * Doctor verification backend will be connected
       * in the external authentication backend step.
       */

      console.log("Doctor registration data:", formData);

      setSuccess(
        "Registration submitted. Your professional details will be verified before access is granted."
      );

      setTimeout(() => {
        navigate("/pending-approval");
      }, 1500);
    } catch (err) {
      setError(err.message || "Doctor registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container doctor-register-container">

        <div className="auth-header">
          <h1>Doctor Registration</h1>

          <p>
            Register as a referring healthcare professional.
            Professional verification is required before accessing
            patient laboratory reports.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <DoctorRegistrationFields
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
            {loading
              ? "Submitting..."
              : "Submit for Verification"}
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

export default DoctorRegister;