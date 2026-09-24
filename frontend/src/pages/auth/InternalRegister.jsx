import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../../services/authService";

import CommonRegistrationFields from "./register/CommonRegistrationFields";
import RoleSelector from "./register/RoleSelector";
import TechnicianRegistrationFields from "./register/TechnicianRegistrationFields";
import PathologistRegistrationFields from "./register/PathologistRegistrationFields";
import QualityManagerRegistrationFields from "./register/QualityManagerRegistrationFields";
import RegistrationMessages from "./register/RegistrationMessages";

const InternalRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    department: "",
    role: "",
  });

  const [profile, setProfile] = useState({
    employeeId: "",
    qualification: "",
    assignedShift: "",
    workstation: "",
    certification: "",

    medicalRegistrationId: "",
    specialization: "",
    registrationAuthority: "",
    registrationValidUntil: "",

    auditResponsibility: "",
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

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((previousProfile) => ({
      ...previousProfile,
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

    if (!formData.password) {
      return "Password is required.";
    }

    if (formData.password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    if (!formData.phone.trim()) {
      return "Phone number is required.";
    }

    const phonePattern = /^\+91[6-9]\d{9}$/;

    if (!phonePattern.test(formData.phone.trim())) {
      return "Enter a valid Indian phone number, for example +919876543210.";
    }

    if (!formData.department.trim()) {
      return "Department is required.";
    }

    if (!formData.role) {
      return "Please select your role.";
    }

    if (
      formData.role === "TECHNICIAN" ||
      formData.role === "QUALITY_MANAGER"
    ) {
      if (!profile.employeeId.trim()) {
        return "Employee ID is required.";
      }

      if (!profile.qualification.trim()) {
        return "Qualification is required.";
      }
    }

    if (formData.role === "PATHOLOGIST") {
      if (!profile.medicalRegistrationId.trim()) {
        return "Medical Registration ID is required.";
      }

      if (!profile.qualification.trim()) {
        return "Qualification is required.";
      }

      if (!profile.specialization.trim()) {
        return "Specialization is required.";
      }

      if (!profile.registrationAuthority.trim()) {
        return "Registration authority is required.";
      }
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

      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        department: formData.department.trim(),
        role: formData.role,
        profile,
      };

      await registerUser(registrationData);

      setSuccess(
        "Registration submitted successfully. Your account is pending administrator approval."
      );

      setTimeout(() => {
        navigate("/pending-approval");
      }, 1500);
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container internal-register-container">

        <div className="auth-header">
          <h1>Staff Registration</h1>

          <p>
            Register as a laboratory staff member. Your account will
            require administrator approval before you can access the system.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <CommonRegistrationFields
            formData={formData}
            handleChange={handleChange}
          />

          <RoleSelector
            role={formData.role}
            handleChange={handleChange}
          />

          {formData.role === "TECHNICIAN" && (
            <TechnicianRegistrationFields
              profile={profile}
              handleProfileChange={handleProfileChange}
            />
          )}

          {formData.role === "PATHOLOGIST" && (
            <PathologistRegistrationFields
              profile={profile}
              handleProfileChange={handleProfileChange}
            />
          )}

          {formData.role === "QUALITY_MANAGER" && (
            <QualityManagerRegistrationFields
              profile={profile}
              handleProfileChange={handleProfileChange}
            />
          )}

          <RegistrationMessages
            error={error}
            success={success}
          />

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Registration"}
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

export default InternalRegister;