import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import DashboardSection from "../dashboard/components/DashboardSection";

const AddUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "TECHNICIAN",
    phone: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("User form submitted:", formData);
    navigate("/users");
  };

  return (
    <main className="dashboard-page">
      <DashboardHeader
        title="Add User"
        subtitle="Create a new internal laboratory system user."
      />

      <DashboardSection
        title="User Information"
        subtitle="Enter the basic details and assign an appropriate role."
      >
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-field">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="ADMIN">Admin</option>
                <option value="TECHNICIAN">Technician</option>
                <option value="PATHOLOGIST">Pathologist</option>
                <option value="QUALITY_MANAGER">Quality Manager</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/users")}
            >
              Cancel
            </button>

            <button type="submit" className="primary-button">
              Create User
            </button>
          </div>
        </form>
      </DashboardSection>
    </main>
  );
};

export default AddUser;