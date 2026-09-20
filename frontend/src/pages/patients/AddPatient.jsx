import { useState } from "react";
import PatientForm from "../../components/forms/PatientForm";
import { createPatient } from "../../services/patientService";

const AddPatient = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setMessage("");

      await createPatient(formData);

      setMessage("Patient created successfully");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add Patient</h1>

      <PatientForm
        onSubmit={handleSubmit}
        loading={loading}
      />

      {message && <p>{message}</p>}
    </div>
  );
};

export default AddPatient;