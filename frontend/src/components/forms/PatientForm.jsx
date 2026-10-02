import { useState } from "react";
import { User, Hash, Calendar, Phone, Mail, MapPin } from "lucide-react";

import "../../styles/patient-form.css";

const PatientForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    patientId: "",
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit(formData);

    setFormData({
      patientId: "",
      name: "",
      age: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
    });
  };

  return (
    <form className="patient-form" onSubmit={handleSubmit}>
      <div className="patient-form-card">
        <div className="patient-form-card-header">
          <div>
            <h2>Patient Information</h2>
            <p>Enter the patient's basic demographic and contact details.</p>
          </div>

          <div className="patient-form-badge">
            <User size={17} />
            New Patient
          </div>
        </div>

        <div className="patient-form-grid">
          <div className="patient-form-field">
            <label htmlFor="patientId">
              <Hash size={15} />
              Patient ID
            </label>

            <input
              id="patientId"
              type="text"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              placeholder="PATIENT002"
              required
            />
          </div>

          <div className="patient-form-field">
            <label htmlFor="name">
              <User size={15} />
              Full Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter patient name"
              required
            />
          </div>

          <div className="patient-form-field">
            <label htmlFor="age">
              <Calendar size={15} />
              Age
            </label>

            <input
              id="age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="25"
              min="0"
              required
            />
          </div>

          <div className="patient-form-field">
            <label htmlFor="gender">
              <User size={15} />
              Gender
            </label>

            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="patient-form-field">
            <label htmlFor="phone">
              <Phone size={15} />
              Phone Number
            </label>

            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="patient-form-field">
            <label htmlFor="email">
              <Mail size={15} />
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="patient@example.com"
            />
          </div>

          <div className="patient-form-field patient-form-field-full">
            <label htmlFor="address">
              <MapPin size={15} />
              Address
            </label>

            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter patient's complete address"
              rows="4"
            />
          </div>
        </div>

        <div className="patient-form-footer">
          <div className="patient-form-required-note">
            <span>*</span>
            Required fields
          </div>

          <button
            className="patient-form-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Patient..." : "Create Patient Record"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PatientForm;