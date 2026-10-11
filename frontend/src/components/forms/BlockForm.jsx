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

    const submitted = await onSubmit(formData);
    if (submitted === false) return;

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
    <form className="workflow-entry-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="blockId">Block ID</label>
        <input
          type="text"
          id="blockId"
          name="blockId"
          value={formData.blockId}
          onChange={handleChange}
          placeholder="BLOCK002"
          required
        />
      </div>

      <div>
        <label htmlFor="specimen">Specimen ID</label>
        <input
          type="text"
          id="specimen"
          name="specimen"
          value={formData.specimen}
          onChange={handleChange}
          placeholder="Specimen MongoDB ID"
          required
        />
      </div>

      <div>
        <label htmlFor="case">Case ID</label>
        <input
          type="text"
          id="case"
          name="case"
          value={formData.case}
          onChange={handleChange}
          placeholder="Case MongoDB ID"
          required
        />
      </div>

      <div>
        <label htmlFor="blockType">Block Type</label>
        <input
          type="text"
          id="blockType"
          name="blockType"
          value={formData.blockType}
          onChange={handleChange}
          placeholder="PARAFFIN"
          required
        />
      </div>

      <div>
        <label htmlFor="tissueDescription">Tissue Description</label>
        <textarea
          name="tissueDescription"
          id="tissueDescription"
          value={formData.tissueDescription}
          onChange={handleChange}
          placeholder="Describe the tissue"
        />
      </div>

      <div>
        <label htmlFor="blockNotes">Notes</label>
        <textarea
          name="notes"
          id="blockNotes"
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
