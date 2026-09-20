import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createSpecimen } from "../../services/specimenService";

const AddSpecimen = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    specimenId: "",
    case: "",
    specimenType: "",
    collectionSite: "",
    collectionDate: "",
    receivedDate: "",
    condition: "GOOD",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await createSpecimen(formData);

      navigate("/specimens");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add Specimen</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Specimen ID</label>

          <input
            type="text"
            name="specimenId"
            value={formData.specimenId}
            onChange={handleChange}
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
            placeholder="Enter Case MongoDB ID"
            required
          />
        </div>

        <div>
          <label>Specimen Type</label>

          <input
            type="text"
            name="specimenType"
            value={formData.specimenType}
            onChange={handleChange}
            placeholder="Example: Tissue Biopsy"
            required
          />
        </div>

        <div>
          <label>Collection Site</label>

          <input
            type="text"
            name="collectionSite"
            value={formData.collectionSite}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Collection Date</label>

          <input
            type="date"
            name="collectionDate"
            value={formData.collectionDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Received Date</label>

          <input
            type="date"
            name="receivedDate"
            value={formData.receivedDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Condition</label>

          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="GOOD">Good</option>
            <option value="DAMAGED">Damaged</option>
            <option value="INADEQUATE">Inadequate</option>
          </select>
        </div>

        <div>
          <label>Notes</label>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Specimen"}
        </button>
      </form>
    </div>
  );
};

export default AddSpecimen;
