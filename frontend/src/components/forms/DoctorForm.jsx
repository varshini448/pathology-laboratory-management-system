import React from "react";

const DoctorForm = ({
  values = {},
  onChange,
  onSubmit,
  loading = false,
}) => {
  const handleChange = (event) => {
    onChange?.({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <form className="common-form" onSubmit={onSubmit}>
      <div className="form-section-title">
        <h2>Doctor Information</h2>
        <p>Enter the referring doctor's details.</p>
      </div>

      <div className="form-grid">
        <label>
          Doctor ID
          <input
            name="doctorId"
            value={values.doctorId || ""}
            onChange={handleChange}
            placeholder="DOC001"
          />
        </label>

        <label>
          Doctor Name
          <input
            name="name"
            value={values.name || ""}
            onChange={handleChange}
            placeholder="Dr. Priya Sharma"
            required
          />
        </label>

        <label>
          Specialization
          <input
            name="specialization"
            value={values.specialization || ""}
            onChange={handleChange}
            placeholder="Pathology"
          />
        </label>

        <label>
          Hospital / Institution
          <input
            name="hospital"
            value={values.hospital || ""}
            onChange={handleChange}
            placeholder="Hospital name"
          />
        </label>

        <label>
          Phone
          <input
            name="phone"
            value={values.phone || ""}
            onChange={handleChange}
            placeholder="+91"
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={values.email || ""}
            onChange={handleChange}
            placeholder="doctor@example.com"
          />
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Doctor"}
        </button>
      </div>
    </form>
  );
};

export default DoctorForm;