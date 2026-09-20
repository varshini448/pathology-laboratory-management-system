import { useState } from "react";
import CaseForm from "../../components/forms/CaseForm";
import { createCase } from "../../services/caseService";

const AddCase = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setMessage("");

      await createCase(formData);

      setMessage("Case created successfully");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add Case</h1>

      <CaseForm
        onSubmit={handleSubmit}
        loading={loading}
      />

      {message && <p>{message}</p>}
    </div>
  );
};

export default AddCase;