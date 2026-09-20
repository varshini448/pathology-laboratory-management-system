import { useState } from "react";
import SlideForm from "../../components/forms/SlideForm";
import { createSlide } from "../../services/slideService";

const AddSlide = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setMessage("");

      await createSlide(formData);

      setMessage("Slide created successfully");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add Slide</h1>

      <SlideForm onSubmit={handleSubmit} loading={loading} />

      {message && <p>{message}</p>}
    </div>
  );
};

export default AddSlide;