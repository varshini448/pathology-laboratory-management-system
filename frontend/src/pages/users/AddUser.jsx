import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Stethoscope,
  ClipboardCheck,
} from "lucide-react";
import { registerUser } from "../../services/authService";
import "../../styles/users/add-user.css";

import AddUserHeader from "./add-user/AddUserHeader";
import AddUserForm from "./add-user/AddUserForm";
import AddUserSidebar from "./add-user/AddUserSidebar";
import AddUserSuccess from "./add-user/AddUserSuccess";

const initialForm = {
  name: "",
  email: "",
  phone: "+91",
  department: "",
  role: "TECHNICIAN",
  password: "",
  confirmPassword: "",
  employeeId: "",
  qualification: "",
  medicalRegistrationId: "",
  specialization: "",
};

const roleOptions = [
  {
    value: "TECHNICIAN",
    label: "Laboratory Technician",
    description: "Laboratory processing and specimen handling",
    icon: BriefcaseBusiness,
  },
  {
    value: "PATHOLOGIST",
    label: "Pathologist",
    description: "Diagnostic review and pathology reporting",
    icon: Stethoscope,
  },
  {
    value: "QUALITY_MANAGER",
    label: "Quality Manager",
    description: "Quality assurance and compliance",
    icon: ClipboardCheck,
  },
];

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setError("");
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setError("");
    setFormData((previous) => ({
      ...previous,
      role,
      employeeId: "",
      qualification: "",
      medicalRegistrationId: "",
      specialization: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please check both fields.");
      return;
    }

    if (!/^\+91[6-9]\d{9}$/.test(formData.phone.trim())) {
      setError("Enter a valid Indian mobile number, for example +919876543210.");
      return;
    }

    const profile = {
      employeeId: formData.employeeId.trim(),
      qualification: formData.qualification.trim(),
      medicalRegistrationId: formData.medicalRegistrationId.trim(),
      specialization: formData.specialization.trim(),
    };

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      department: formData.department.trim(),
      role: formData.role,
      password: formData.password,
      profile,
    };

    setSubmitting(true);

    try {
      const response = await registerUser(payload);
      setSuccess({
        message:
          response.message ||
          "Registration submitted. The account is pending administrator approval.",
        user: response.user,
      });
    } catch (requestError) {
      setError(
        requestError.message ||
          "We couldn't submit this registration. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedRole = roleOptions.find(
    (option) => option.value === formData.role
  );

  const handleAddAnother = () => {
    setFormData(initialForm);
    setError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setSuccess(null);
  };

  if (success) {
    return (
      <AddUserSuccess
        success={success}
        onAddAnother={handleAddAnother}
      />
    );
  }

  return (
    <main className="dashboard-page add-user-page">
      <AddUserHeader />

      <div className="add-user-layout">
        <AddUserForm
          formData={formData}
          roleOptions={roleOptions}
          selectedRole={selectedRole}
          error={error}
          submitting={submitting}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          handleChange={handleChange}
          handleRoleChange={handleRoleChange}
          handleSubmit={handleSubmit}
          setShowPassword={setShowPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          onCancel={() => navigate("/users")}
        />

        <AddUserSidebar />
      </div>
    </main>
  );
};

export default AddUser;
