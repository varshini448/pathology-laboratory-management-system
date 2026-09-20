import { useState } from "react";

const SlideForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    slideId: "",
    block: "",
    case: "",
    slideType: "",
    stainingMethod: "",
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
      slideId: "",
      block: "",
      case: "",
      slideType: "",
      stainingMethod: "",
      notes: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Slide ID</label>
        <input
          type="text"
          name="slideId"
          value={formData.slideId}
          onChange={handleChange}
          placeholder="SLIDE002"
          required
        />
      </div>

      <div>
        <label>Block ID</label>
        <input
          type="text"
          name="block"
          value={formData.block}
          onChange={handleChange}
          placeholder="Block MongoDB ID"
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
        <label>Slide Type</label>
        <input
          type="text"
          name="slideType"
          value={formData.slideType}
          onChange={handleChange}
          placeholder="HISTOLOGY"
          required
        />
      </div>

      <div>
        <label>Staining Method</label>
        <input
          type="text"
          name="stainingMethod"
          value={formData.stainingMethod}
          onChange={handleChange}
          placeholder="H&E"
        />
      </div>

      <div>
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Slide notes"
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Slide"}
      </button>
    </form>
  );
};

export default SlideForm;