import { useState } from "react";
import SlideForm from "../../components/forms/SlideForm";
import PageHeader from "../../components/layout/PageHeader";
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
      return true;
    } catch (error) {
      setMessage(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="workflow-form-page">
      <PageHeader eyebrow="LABORATORY WORKFLOW" title="Add slide" description="Register a slide and connect it to its block and case." />
      <SlideForm onSubmit={handleSubmit} loading={loading} />

      {message && <p className={message.includes("successfully") ? "workflow-form-success" : "workflow-form-error"} role={message.includes("successfully") ? "status" : "alert"}>{message}</p>}
    </main>
  );
};

export default AddSlide;
