import { useState } from "react";
import BlockForm from "../../components/forms/BlockForm";
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
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add Block</h1>

      <BlockForm
        onSubmit={handleSubmit}
        loading={loading}
      />

      {message && <p>{message}</p>}
    </div>
  );
};

export default AddBlock;