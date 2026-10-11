import { useState } from "react";
import BlockForm from "../../components/forms/BlockForm";
import PageHeader from "../../components/layout/PageHeader";
import { createBlock } from "../../services/blockService";

const AddBlock = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setMessage("");

      await createBlock(formData);

      setMessage("Block created successfully");
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
      <PageHeader eyebrow="LABORATORY WORKFLOW" title="Add block" description="Connect a prepared tissue block to its specimen and case record." />
      <BlockForm
        onSubmit={handleSubmit}
        loading={loading}
      />

      {message && <p className={message.includes("successfully") ? "workflow-form-success" : "workflow-form-error"} role={message.includes("successfully") ? "status" : "alert"}>{message}</p>}
    </main>
  );
};

export default AddBlock;
