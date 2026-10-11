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

    const submitted = await onSubmit(formData);
    if (submitted === false) return;

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
    <form className="workflow-entry-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="slideId">Slide ID</label>
        <input
          type="text"
          id="slideId"
          name="slideId"
          value={formData.slideId}
          onChange={handleChange}
          placeholder="SLIDE002"
          required
        />
      </div>

      <div>
        <label htmlFor="block">Block ID</label>
        <input
          type="text"
          id="block"
          name="block"
          value={formData.block}
          onChange={handleChange}
          placeholder="Block MongoDB ID"
          required
        />
      </div>

      <div>
        <label htmlFor="slideCase">Case ID</label>
        <input
          type="text"
          id="slideCase"
          name="case"
          value={formData.case}
          onChange={handleChange}
          placeholder="Case MongoDB ID"
          required
        />
      </div>

      <div>
        <label htmlFor="slideType">Slide Type</label>
        <input
          type="text"
          id="slideType"
          name="slideType"
          value={formData.slideType}
          onChange={handleChange}
          placeholder="HISTOLOGY"
          required
        />
      </div>

      <div>
        <label htmlFor="stainingMethod">Staining Method</label>
        <input
          type="text"
          name="stainingMethod"
          id="stainingMethod"
          value={formData.stainingMethod}
          onChange={handleChange}
          placeholder="H&E"
        />
      </div>

      <div>
        <label htmlFor="slideNotes">Notes</label>
        <textarea
          name="notes"
          id="slideNotes"
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
