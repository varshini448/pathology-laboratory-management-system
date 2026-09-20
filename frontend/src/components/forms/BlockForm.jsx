import { useState } from "react";

const BlockForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    blockId: "",
    specimen: "",
    case: "",
    blockType: "",
    tissueDescription: "",
    notes: "",
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
      blockId: "",
      specimen: "",
      case: "",
      blockType: "",
      tissueDescription: "",
      notes: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Block ID</label>
        <input
          type="text"
          name="blockId"
          value={formData.blockId}
          onChange={handleChange}
          placeholder="BLOCK002"
          required
        />
      </div>

      <div>
        <label>Specimen ID</label>
        <input
          type="text"
          name="specimen"
          value={formData.specimen}
          onChange={handleChange}
          placeholder="Specimen MongoDB ID"
          required
        />
      </div>

      <div>
        <label>Case ID</label>
        <input
          type="text"
          name="case"
          value={formData.case}
          onChange={handleChange}
          placeholder="Case MongoDB ID"
          required
        />
      </div>

      <div>
        <label>Block Type</label>
        <input
          type="text"
          name="blockType"
          value={formData.blockType}
          onChange={handleChange}
          placeholder="PARAFFIN"
          required
        />
      </div>

      <div>
        <label>Tissue Description</label>
        <textarea
          name="tissueDescription"
          value={formData.tissueDescription}
          onChange={handleChange}
          placeholder="Describe the tissue"
        />
      </div>

      <div>
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Block notes"
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Block"}
      </button>
    </form>
  );
};

export default BlockForm;